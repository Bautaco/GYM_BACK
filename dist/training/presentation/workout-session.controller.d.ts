import { WorkoutSessionService } from '../application/workout-session.service.js';
import { LogWorkoutSessionDto } from './dtos/log-workout-session.dto.js';
export declare class WorkoutSessionController {
    private readonly sessionService;
    constructor(sessionService: WorkoutSessionService);
    logSession(dto: LogWorkoutSessionDto): Promise<import("../application/workout-session.service.js").LogWorkoutSessionResult>;
    getAthleteSessions(athleteId: string): Promise<import("../domain/workout-session.entity.js").WorkoutSession[]>;
}
