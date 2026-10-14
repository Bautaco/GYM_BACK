import { Repository } from 'typeorm';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { IWorkoutSessionRepository } from '../domain/workout-session.repository.interface.js';
import { WorkoutSessionOrmEntity } from './workout-session.orm-entity.js';
import { LoggedSetOrmEntity } from './logged-set.orm-entity.js';
export declare class TypeOrmWorkoutSessionRepository implements IWorkoutSessionRepository {
    private readonly sessionRepo;
    private readonly setRepo;
    constructor(sessionRepo: Repository<WorkoutSessionOrmEntity>, setRepo: Repository<LoggedSetOrmEntity>);
    private toDomain;
    private toOrm;
    save(session: WorkoutSession): Promise<WorkoutSession>;
    findByAthleteId(athleteId: string): Promise<WorkoutSession[]>;
    findByAthleteAndDate(athleteId: string, date: Date): Promise<WorkoutSession | null>;
    countCompletedByAthleteInDateRange(athleteId: string, startDate: Date, endDate: Date): Promise<number>;
    findExerciseMaxHistory(athleteId: string, exerciseId: string): Promise<{
        date: string;
        maxWeightKg: number;
        estimated1RM: number;
    }[]>;
}
