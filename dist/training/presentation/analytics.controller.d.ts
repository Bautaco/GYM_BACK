import { AnalyticsService } from '../application/analytics.service.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStrengthProgress(athleteId: string, exerciseId: string): Promise<{
        exerciseId: string;
        exerciseName: string;
        grupoMuscularPrincipal: string;
        history: {
            date: string;
            maxWeightKg: number;
            estimated1RM: number;
        }[];
    }>;
    getAdherence(athleteId: string): Promise<{
        athleteId: string;
        hasActivePlan: boolean;
        adherencePercentage: number;
        completedSessions: number;
        plannedSessions: number;
        message: string;
        planName?: undefined;
    } | {
        athleteId: string;
        hasActivePlan: boolean;
        planName: string;
        completedSessions: number;
        plannedSessions: number;
        adherencePercentage: number;
        message: string;
    }>;
}
