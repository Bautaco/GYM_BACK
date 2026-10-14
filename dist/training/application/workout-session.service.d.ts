import { IWorkoutSessionRepository } from '../domain/workout-session.repository.interface.js';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { LogWorkoutSessionDto } from '../presentation/dtos/log-workout-session.dto.js';
export interface DetectedPR {
    exerciseId: string;
    exerciseName: string;
    type: 'PESO_MAXIMO' | '1RM_ESTIMADO';
    previousRecord: number;
    newRecord: number;
    improvement: number;
}
export interface LogWorkoutSessionResult {
    session: WorkoutSession;
    personalRecords: DetectedPR[];
}
export declare class WorkoutSessionService {
    private readonly sessionRepo;
    constructor(sessionRepo: IWorkoutSessionRepository);
    logSession(dto: LogWorkoutSessionDto): Promise<LogWorkoutSessionResult>;
    getSessionsByAthlete(athleteId: string): Promise<WorkoutSession[]>;
}
