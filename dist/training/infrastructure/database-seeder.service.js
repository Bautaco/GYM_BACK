var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseSeederService_1;
import { Injectable, Logger, Inject } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { USER_REPOSITORY_TOKEN } from '../../users/domain/user.repository.interface.js';
import { User } from '../../users/domain/user.entity.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
import { EXERCISE_REPOSITORY_TOKEN } from '../domain/exercise.repository.interface.js';
import { Exercise } from '../domain/exercise.entity.js';
import { TRAINING_PLAN_REPOSITORY_TOKEN } from '../domain/training-plan.repository.interface.js';
import { TrainingPlan } from '../domain/training-plan.entity.js';
import { Routine } from '../domain/routine.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { BODY_WEIGHT_REPOSITORY_TOKEN } from '../domain/body-weight.repository.interface.js';
import { BodyWeightRecord } from '../domain/body-weight-record.entity.js';
import { WORKOUT_SESSION_REPOSITORY_TOKEN } from '../domain/workout-session.repository.interface.js';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { LoggedSet } from '../domain/logged-set.entity.js';
import { ROUTINE_TEMPLATE_REPOSITORY_TOKEN } from '../domain/routine-template.repository.interface.js';
import { RoutineTemplate } from '../domain/routine-template.entity.js';
let DatabaseSeederService = DatabaseSeederService_1 = class DatabaseSeederService {
    userRepo;
    exerciseRepo;
    planRepo;
    bodyWeightRepo;
    sessionRepo;
    templateRepo;
    logger = new Logger(DatabaseSeederService_1.name);
    constructor(userRepo, exerciseRepo, planRepo, bodyWeightRepo, sessionRepo, templateRepo) {
        this.userRepo = userRepo;
        this.exerciseRepo = exerciseRepo;
        this.planRepo = planRepo;
        this.bodyWeightRepo = bodyWeightRepo;
        this.sessionRepo = sessionRepo;
        this.templateRepo = templateRepo;
    }
    async onApplicationBootstrap() {
        await this.seedUsers();
        await this.seedExercises();
        await this.seedSamplePlanAndMetrics();
        await this.seedTemplates();
    }
    async seedUsers() {
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('admin123', salt);
        const trainerPass = await bcrypt.hash('admin123', salt);
        const athletePass = await bcrypt.hash('atleta123', salt);
        const existingAdmin = await this.userRepo.findByEmail('admin@gym.com');
        if (!existingAdmin) {
            const admin = new User('', 'admin@gym.com', adminPass, 'Administrador del Sistema', UserRole.ADMIN, new Date(), new Date(), '+54 9 11 0000-1111', 'Gestión global de la plataforma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
            await this.userRepo.save(admin);
            this.logger.log('✅ Usuario Administrador inicializado (admin@gym.com).');
        }
        const count = await this.userRepo.count();
        if (count > 1)
            return;
        this.logger.log('🌱 Inicializando usuarios por defecto...');
        const trainer = new User('', 'entrenador@gym.com', trainerPass, 'Prof. Carlos Mendoza', UserRole.ENTRENADOR, new Date(), new Date(), '+54 9 11 4455-6677', 'Especialista en Fuerza e Hipertrofia', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');
        const savedTrainer = await this.userRepo.save(trainer);
        const athlete1 = new User('', 'atleta@gym.com', athletePass, 'Lucas Gómez', UserRole.ATLETA, new Date(), new Date(), '+54 9 11 9988-7766', 'Objetivo: Ganancia de masa muscular y fuerza en sentadillas', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', savedTrainer.id);
        await this.userRepo.save(athlete1);
        const athlete2 = new User('', 'marcos@gym.com', athletePass, 'Marcos Paz', UserRole.ATLETA, new Date(), new Date(), '+54 9 11 1122-3344', 'Objetivo: Recomposición corporal', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', savedTrainer.id);
        await this.userRepo.save(athlete2);
        this.logger.log('✅ Usuarios base creados.');
    }
    async seedExercises() {
        this.logger.log('🌱 Verificando y actualizando catálogo oficial de ejercicios con videos...');
        const sampleExercises = [
            {
                nombre: 'Sentadilla Profunda',
                grupo: 'Piernas',
                zonas: ['Cuádriceps', 'Glúteo Mayor', 'Core', 'Aductores'],
                desc: 'Pies al ancho de hombros con puntas ligeramente hacia afuera. Flexión simultánea de cadera y rodillas descendiendo por debajo del paralelo, manteniendo columna neutra y pecho erguido.',
                video: 'https://www.youtube.com/watch?v=vmNPOjaGrVE',
            },
            {
                nombre: 'Press de Banca Plano',
                grupo: 'Pecho',
                zonas: ['Pectoral Mayor', 'Tríceps Braquial', 'Deltoides Anterior'],
                desc: 'Tumbado en banco plano con 5 puntos de apoyo (pies, glúteo, escápulas y cabeza). Retracción escapular, descenso controlado de la barra al tercio medio del esternón y empuje concéntrico vertical.',
                video: 'https://www.youtube.com/shorts/UgmYbrytasw',
            },
            {
                nombre: 'Peso Muerto Convencional',
                grupo: 'Espalda',
                zonas: ['Isquiotibiales', 'Glúteo Mayor', 'Erectores Espinales', 'Dorsal Ancho'],
                desc: 'Barra pegada a las tibias. Agarre en pronación al ancho de hombros. Empujar el suelo con los pies extendiendo rodillas y caderas al unísono manteniendo la espalda en posición anatómica neutra.',
                video: 'https://www.youtube.com/watch?v=wn_z0cW1z4o',
            },
            {
                nombre: 'Press Militar con Barra',
                grupo: 'Hombros',
                zonas: ['Deltoides Anterior', 'Deltoides Lateral', 'Tríceps', 'Core'],
                desc: 'De pie con abdomen y glúteos contraídos. Barra apoyada sobre clavículas, empujar verticalmente por delante del rostro hasta bloquear codos sobre la cabeza.',
                video: 'https://www.youtube.com/watch?v=QAuyfgywb-k',
            },
            {
                nombre: 'Dominadas Pronas (Pull-ups)',
                grupo: 'Espalda',
                zonas: ['Dorsal Ancho', 'Redondo Mayor', 'Bíceps Braquial', 'Braquiorradial'],
                desc: 'Colgado de la barra con agarre ligeramente más ancho que los hombros. Tirar llevando el pecho hacia la barra mediante depresión y retracción escapular.',
                video: 'https://www.youtube.com/watch?v=sPej2dr2J5s',
            },
            {
                nombre: 'Fondos en Paralelas (Dips)',
                grupo: 'Brazos',
                zonas: ['Tríceps Braquial', 'Pectoral Menor', 'Deltoides Anterior'],
                desc: 'Sostenerse en barras paralelas. Flexionar codos hasta 90 grados con el torso ligeramente inclinado y empujar con fuerza hasta la extensión completa.',
                video: 'https://www.youtube.com/watch?v=sM6XUdt1rm4',
            },
        ];
        const currentExercises = await this.exerciseRepo.findAll();
        for (const sample of sampleExercises) {
            const match = currentExercises.find((e) => e.nombre.trim().toLowerCase() === sample.nombre.trim().toLowerCase());
            if (match) {
                if (match.videoUrl !== sample.video) {
                    match.videoUrl = sample.video;
                    await this.exerciseRepo.save(match);
                    this.logger.log(`🔄 Video actualizado para: ${match.nombre} -> ${sample.video}`);
                }
            }
            else {
                await this.exerciseRepo.save(new Exercise('', sample.nombre, sample.grupo, sample.zonas, sample.desc, sample.video));
            }
        }
        this.logger.log('✅ Catálogo de ejercicios sincronizado con videos reales.');
    }
    async seedSamplePlanAndMetrics() {
        const athlete = await this.userRepo.findByEmail('atleta@gym.com');
        const trainer = await this.userRepo.findByEmail('entrenador@gym.com');
        if (!athlete || !trainer)
            return;
        const existingPlan = await this.planRepo.findActiveByAthleteId(athlete.id);
        if (existingPlan)
            return;
        const exercises = await this.exerciseRepo.findAll();
        if (exercises.length === 0)
            return;
        this.logger.log('🌱 Asignando plan inicial de entrenamiento al atleta...');
        const squat = exercises.find((e) => e.nombre.includes('Sentadilla')) || exercises[0];
        const bench = exercises.find((e) => e.nombre.includes('Press de Banca')) || exercises[1];
        const deadlift = exercises.find((e) => e.nombre.includes('Peso Muerto')) || exercises[2];
        const overhead = exercises.find((e) => e.nombre.includes('Press Militar')) || exercises[3];
        const routineDay1 = new Routine('', 'Día 1: Fuerza Inferior y Tren Superior', 1, [
            new ExerciseItem('', squat.id, squat.nombre, 4, 8, 80, 120, 'Descanso 2 min entre series'),
            new ExerciseItem('', bench.id, bench.nombre, 4, 10, 65, 90, 'Control excéntrico de 2 seg'),
        ], 'Sesión focalizada en cargas principales de tren inferior y pectoral.');
        const routineDay2 = new Routine('', 'Día 2: Tracción y Cadena Posterior', 3, [
            new ExerciseItem('', deadlift.id, deadlift.nombre, 3, 6, 110, 150, 'Cinturón recomendado'),
            new ExerciseItem('', overhead.id, overhead.nombre, 3, 10, 45, 90, 'Core firme'),
        ], 'Trabajo de fuerza pura en bisagra de cadera y empuje vertical.');
        const now = new Date();
        const fourWeeksLater = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
        const plan = new TrainingPlan('', 'Fuerza e Hipertrofia Fase 1 (4 Semanas)', athlete.id, trainer.id, now, fourWeeksLater, true, [routineDay1, routineDay2], athlete.fullName, trainer.fullName, now);
        const savedPlan = await this.planRepo.save(plan);
        const pastDays = [21, 14, 7, 0];
        const weights = [77.2, 76.5, 75.9, 75.5];
        for (let i = 0; i < pastDays.length; i++) {
            const date = new Date(Date.now() - pastDays[i] * 24 * 60 * 60 * 1000);
            await this.bodyWeightRepo.save(new BodyWeightRecord('', athlete.id, weights[i], date, `Pesaje semana ${4 - i}`));
        }
        const sessionDates = ['2026-09-22', '2026-09-29', '2026-10-06'];
        const squatWeights = [70, 75, 80];
        for (let i = 0; i < sessionDates.length; i++) {
            const date = new Date(sessionDates[i]);
            const session = new WorkoutSession('', athlete.id, savedPlan.id, savedPlan.routines[0]?.id || 'routine-1', savedPlan.routines[0]?.name || 'Día 1: Pierna y Empuje', date, true, [
                new LoggedSet('', squat.id, squat.nombre, 1, 8, squatWeights[i], true),
                new LoggedSet('', squat.id, squat.nombre, 2, 8, squatWeights[i], true),
                new LoggedSet('', bench.id, bench.nombre, 1, 10, 60 + i * 2.5, true),
            ], 'Sesión completada con buena técnica', undefined, date);
            await this.sessionRepo.save(session);
        }
        this.logger.log('✅ Plan de entrenamiento y métricas históricas de prueba inicializados.');
    }
    async seedTemplates() {
        const count = await this.templateRepo.count();
        if (count > 0)
            return;
        this.logger.log('🌱 Inicializando plantillas de rutinas predefinidas...');
        const exercises = await this.exerciseRepo.findAll();
        const bench = exercises.find((e) => e.nombre.includes('Press de Banca')) || exercises[0];
        const squat = exercises.find((e) => e.nombre.includes('Sentadilla')) || exercises[0];
        const deadlift = exercises.find((e) => e.nombre.includes('Peso Muerto')) || exercises[0];
        const pullup = exercises.find((e) => e.nombre.includes('Dominadas')) || exercises[0];
        const pushTemplate = new RoutineTemplate('', 'SYSTEM', 'Rutina de Empuje (Push) - Pecho, Hombro y Tríceps', 'Enfocada en el desarrollo de la fuerza en empujes horizontales y verticales.', 'Fuerza e Hipertrofia', [
            new ExerciseItem('', bench.id, bench.nombre, 4, 8, 70, 120, 'Retracción escapular activa', '3-0-1-0'),
        ], new Date());
        const pullTemplate = new RoutineTemplate('', 'SYSTEM', 'Rutina de Tracción (Pull) - Espalda y Bíceps', 'Desarrollo de densidad y amplitud dorsal.', 'Fuerza e Hipertrofia', [
            new ExerciseItem('', deadlift.id, deadlift.nombre, 3, 5, 100, 180, 'Bloqueo dorsal neutro', '2-1-1-0'),
            new ExerciseItem('', pullup.id, pullup.nombre, 4, 10, 0, 90, 'Rango completo de movimiento', '3-0-1-1'),
        ], new Date());
        const legsTemplate = new RoutineTemplate('', 'SYSTEM', 'Rutina de Piernas (Legs) - Cuádriceps e Isquios', 'Máxima activación del tren inferior y estabilidad de cadera.', 'Fuerza e Hipertrofia', [
            new ExerciseItem('', squat.id, squat.nombre, 4, 8, 80, 150, 'Profundidad por debajo del paralelo', '3-1-1-0'),
        ], new Date());
        await this.templateRepo.save(pushTemplate);
        await this.templateRepo.save(pullTemplate);
        await this.templateRepo.save(legsTemplate);
        this.logger.log('✅ Plantillas de rutinas predefinidas creadas.');
    }
};
DatabaseSeederService = DatabaseSeederService_1 = __decorate([
    Injectable(),
    __param(0, Inject(USER_REPOSITORY_TOKEN)),
    __param(1, Inject(EXERCISE_REPOSITORY_TOKEN)),
    __param(2, Inject(TRAINING_PLAN_REPOSITORY_TOKEN)),
    __param(3, Inject(BODY_WEIGHT_REPOSITORY_TOKEN)),
    __param(4, Inject(WORKOUT_SESSION_REPOSITORY_TOKEN)),
    __param(5, Inject(ROUTINE_TEMPLATE_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], DatabaseSeederService);
export { DatabaseSeederService };
//# sourceMappingURL=database-seeder.service.js.map