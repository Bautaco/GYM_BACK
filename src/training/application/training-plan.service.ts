import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ITrainingPlanRepository,
  TRAINING_PLAN_REPOSITORY_TOKEN,
} from '../domain/training-plan.repository.interface.js';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../users/domain/user.repository.interface.js';
import { TrainingPlan } from '../domain/training-plan.entity.js';
import { Routine } from '../domain/routine.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { CreateTrainingPlanDto } from '../presentation/dtos/create-training-plan.dto.js';

@Injectable()
export class TrainingPlanService {
  constructor(
    @Inject(TRAINING_PLAN_REPOSITORY_TOKEN)
    private readonly planRepo: ITrainingPlanRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: IUserRepository,
  ) {}

  private async validateNoDateOverlap(
    athleteId: string,
    startDateStr: string,
    endDateStr: string,
    excludePlanId?: string,
  ): Promise<void> {
    const existingPlans = (await this.planRepo.findAllByAthleteId(athleteId)) || [];
    const newStart = new Date(startDateStr).toISOString().slice(0, 10);
    const newEnd = new Date(endDateStr).toISOString().slice(0, 10);
    const todayStr = new Date().toISOString().slice(0, 10);

    for (const plan of existingPlans) {
      if (excludePlanId && plan.id === excludePlanId) {
        continue;
      }

      const pStart = plan.startDate instanceof Date
        ? plan.startDate.toISOString().slice(0, 10)
        : String(plan.startDate).slice(0, 10);
      const pEnd = plan.endDate instanceof Date
        ? plan.endDate.toISOString().slice(0, 10)
        : String(plan.endDate).slice(0, 10);

      // Una rutina activa o programada: isActive=true, o endDate >= hoy, o startDate >= hoy
      const isCurrentOrUpcoming = plan.isActive || pEnd >= todayStr || pStart >= todayStr;
      if (!isCurrentOrUpcoming) {
        continue;
      }

      // Validación de superposición: [newStart, newEnd] interseca [pStart, pEnd]
      if (newStart <= pEnd && newEnd >= pStart) {
        throw new BadRequestException(
          'El alumno ya tiene una rutina asignada en el rango de fechas seleccionado',
        );
      }
    }
  }

  async createPlan(
    dto: CreateTrainingPlanDto,
    trainerId: string,
    trainerName?: string,
  ): Promise<TrainingPlan> {
    if (!dto.athleteId || !dto.name) {
      throw new BadRequestException(
        'El nombre del plan y el atleta asignado son campos obligatorios',
      );
    }

    const athlete = await this.userRepo.findById(dto.athleteId);
    if (!athlete) {
      throw new NotFoundException('El atleta seleccionado no existe en el sistema');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) {
      throw new BadRequestException(
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
      );
    }

    // Requerimiento 3: Validación de superposición de fechas con rutinas activas o programadas
    await this.validateNoDateOverlap(dto.athleteId, dto.startDate, dto.endDate);

    const todayStr = new Date().toISOString().slice(0, 10);
    const newStartStr = startDate.toISOString().slice(0, 10);
    const isImmediatelyActive = newStartStr <= todayStr;

    if (isImmediatelyActive) {
      // Desactivar planes anteriores activos si el nuevo entra en vigencia inmediatamente
      await this.planRepo.deactivatePreviousPlans(dto.athleteId);
    }

    const routines = (dto.routines || []).map((r) => {
      const items = (r.exerciseItems || []).map(
        (i) =>
          new ExerciseItem(
            '',
            i.exerciseId,
            i.exerciseName,
            i.targetSets,
            i.targetReps,
            i.targetWeightKg,
            i.restSeconds || 90,
            i.notes,
            i.cadence,
          ),
      );
      return new Routine('', r.name, r.dayOfWeek, items, r.description);
    });

    const newPlan = new TrainingPlan(
      '',
      dto.name.trim(),
      dto.athleteId,
      trainerId,
      startDate,
      endDate,
      isImmediatelyActive,
      routines,
      athlete.fullName,
      trainerName || 'Entrenador',
      new Date(),
      dto.frequencyPerWeek ?? 3,
      dto.sessionsPerDay ?? 1,
    );

    return this.planRepo.save(newPlan);
  }

  async updatePlan(
    id: string,
    dto: CreateTrainingPlanDto,
    trainerId: string,
    trainerName?: string,
  ): Promise<TrainingPlan> {
    const existing = await this.planRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Plan de entrenamiento con ID ${id} no encontrado`);
    }

    const athlete = await this.userRepo.findById(dto.athleteId);
    if (!athlete) {
      throw new NotFoundException('El atleta seleccionado no existe en el sistema');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) {
      throw new BadRequestException(
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
      );
    }

    // Requerimiento 3: Validación de superposición excluyendo este mismo plan
    await this.validateNoDateOverlap(dto.athleteId, dto.startDate, dto.endDate, id);

    const routines = (dto.routines || []).map((r) => {
      const items = (r.exerciseItems || []).map(
        (i) =>
          new ExerciseItem(
            '',
            i.exerciseId,
            i.exerciseName,
            i.targetSets,
            i.targetReps,
            i.targetWeightKg,
            i.restSeconds || 90,
            i.notes,
            i.cadence,
          ),
      );
      return new Routine('', r.name, r.dayOfWeek, items, r.description);
    });

    existing.name = dto.name.trim();
    existing.startDate = startDate;
    existing.endDate = endDate;
    existing.routines = routines;
    existing.frequencyPerWeek = dto.frequencyPerWeek ?? existing.frequencyPerWeek ?? 3;
    existing.sessionsPerDay = dto.sessionsPerDay ?? existing.sessionsPerDay ?? 1;
    if (trainerName) existing.trainerName = trainerName;

    return this.planRepo.save(existing);
  }

  async getActivePlanByAthlete(athleteId: string): Promise<TrainingPlan | null> {
    return this.planRepo.findActiveByAthleteId(athleteId);
  }

  async getAllPlansByAthlete(athleteId: string): Promise<TrainingPlan[]> {
    return this.planRepo.findAllByAthleteId(athleteId);
  }

  async getPlanById(id: string): Promise<TrainingPlan> {
    const found = await this.planRepo.findById(id);
    if (!found) {
      throw new NotFoundException(`Plan de entrenamiento con ID ${id} no encontrado`);
    }
    return found;
  }
}
