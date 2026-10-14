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
import { Injectable, Inject } from '@nestjs/common';
import { WORKOUT_SESSION_REPOSITORY_TOKEN, } from '../domain/workout-session.repository.interface.js';
import { TRAINING_PLAN_REPOSITORY_TOKEN, } from '../domain/training-plan.repository.interface.js';
import { EXERCISE_REPOSITORY_TOKEN, } from '../domain/exercise.repository.interface.js';
let AnalyticsService = class AnalyticsService {
    sessionRepo;
    planRepo;
    exerciseRepo;
    constructor(sessionRepo, planRepo, exerciseRepo) {
        this.sessionRepo = sessionRepo;
        this.planRepo = planRepo;
        this.exerciseRepo = exerciseRepo;
    }
    async getStrengthProgress(athleteId, exerciseId) {
        const exercise = await this.exerciseRepo.findById(exerciseId);
        const history = await this.sessionRepo.findExerciseMaxHistory(athleteId, exerciseId);
        return {
            exerciseId,
            exerciseName: exercise ? exercise.nombre : 'Ejercicio',
            grupoMuscularPrincipal: exercise ? exercise.grupoMuscularPrincipal : '',
            history: history.map((item) => ({
                date: item.date,
                maxWeightKg: item.maxWeightKg,
                estimated1RM: item.estimated1RM,
            })),
        };
    }
    async getSessionHistory(athleteId) {
        const sessions = await this.sessionRepo.findByAthleteId(athleteId);
        return sessions.map((s) => ({
            id: s.id,
            routineName: s.routineName,
            date: s.date instanceof Date ? s.date.toISOString().split('T')[0] : String(s.date),
            completed: s.completed,
            totalVolumeKg: s.totalVolume(),
            rpe: s.rpe,
            notes: s.notes,
            completedSetsCount: s.sets.filter((st) => st.isCompleted).length,
            totalSetsCount: s.sets.length,
        }));
    }
    async getAdherence(athleteId) {
        const activePlan = await this.planRepo.findActiveByAthleteId(athleteId);
        const allSessions = await this.sessionRepo.findByAthleteId(athleteId);
        if (!activePlan) {
            return {
                athleteId,
                hasActivePlan: false,
                adherencePercentage: 0,
                completedSessions: allSessions.length,
                plannedSessions: 0,
                message: 'No posee un plan activo en este momento.',
            };
        }
        const routinesPerWeek = activePlan.routines.length || 3;
        const startDate = new Date(activePlan.startDate);
        const endDate = new Date(activePlan.endDate);
        const diffDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const weeksInPlan = Math.max(1, Math.round(diffDays / 7));
        const plannedSessions = weeksInPlan * routinesPerWeek;
        const completedSessions = allSessions.filter((s) => s.completed).length;
        const percentage = plannedSessions > 0
            ? Math.min(100, Math.round((completedSessions / plannedSessions) * 100))
            : 0;
        let incentiveMessage = '¡Sigue así! Cada entrenamiento suma.';
        if (percentage >= 80) {
            incentiveMessage = '¡Excelente constancia! Estás alcanzando tus metas.';
        }
        else if (percentage >= 50) {
            incentiveMessage = 'Buen ritmo, mantén el compromiso esta semana.';
        }
        return {
            athleteId,
            hasActivePlan: true,
            planName: activePlan.name,
            completedSessions,
            plannedSessions,
            adherencePercentage: percentage,
            message: incentiveMessage,
        };
    }
};
AnalyticsService = __decorate([
    Injectable(),
    __param(0, Inject(WORKOUT_SESSION_REPOSITORY_TOKEN)),
    __param(1, Inject(TRAINING_PLAN_REPOSITORY_TOKEN)),
    __param(2, Inject(EXERCISE_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AnalyticsService);
export { AnalyticsService };
//# sourceMappingURL=analytics.service.js.map