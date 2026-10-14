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

    // Deactivate previous active plans for this athlete to guarantee single active plan consistency
    await this.planRepo.deactivatePreviousPlans(dto.athleteId);

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
      true,
      routines,
      athlete.fullName,
      trainerName || 'Entrenador',
      new Date(),
    );

    return this.planRepo.save(newPlan);
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
