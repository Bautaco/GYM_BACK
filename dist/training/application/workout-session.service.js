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
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { WORKOUT_SESSION_REPOSITORY_TOKEN, } from '../domain/workout-session.repository.interface.js';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { LoggedSet } from '../domain/logged-set.entity.js';
let WorkoutSessionService = class WorkoutSessionService {
    sessionRepo;
    constructor(sessionRepo) {
        this.sessionRepo = sessionRepo;
    }
    async logSession(dto) {
        const loggedSets = (dto.sets || []).map((s) => {
            if (s.actualWeightKg < 0) {
                throw new BadRequestException('El peso utilizado no puede ser un valor negativo');
            }
            if (s.actualReps < 0) {
                throw new BadRequestException('Las repeticiones no pueden ser un valor negativo');
            }
            return new LoggedSet('', s.exerciseId, s.exerciseName, s.setNumber, Number(s.actualReps), Number(s.actualWeightKg), s.isCompleted ?? true);
        });
        const session = new WorkoutSession('', dto.athleteId, dto.trainingPlanId, dto.routineId, dto.routineName, new Date(dto.date), dto.completed ?? true, loggedSets, dto.notes, dto.rpe, new Date());
        const previousSessions = (await this.sessionRepo.findByAthleteId(dto.athleteId)) || [];
        const detectedPRs = [];
        const exerciseIds = Array.from(new Set(loggedSets.filter((s) => s.isCompleted).map((s) => s.exerciseId)));
        for (const exId of exerciseIds) {
            const exName = loggedSets.find((s) => s.exerciseId === exId)?.exerciseName || 'Ejercicio';
            const prevWeights = previousSessions.map((ps) => ps.maxWeightForExercise(exId)).filter((w) => w > 0);
            const prevMaxWeight = prevWeights.length > 0 ? Math.max(...prevWeights) : 0;
            const currentMaxWeight = session.maxWeightForExercise(exId);
            if (currentMaxWeight > prevMaxWeight && prevMaxWeight > 0) {
                detectedPRs.push({
                    exerciseId: exId,
                    exerciseName: exName,
                    type: 'PESO_MAXIMO',
                    previousRecord: prevMaxWeight,
                    newRecord: currentMaxWeight,
                    improvement: Math.round((currentMaxWeight - prevMaxWeight) * 10) / 10,
                });
            }
            const prev1RMs = previousSessions.map((ps) => ps.max1RMForExercise(exId)).filter((r) => r > 0);
            const prevMax1RM = prev1RMs.length > 0 ? Math.max(...prev1RMs) : 0;
            const current1RM = session.max1RMForExercise(exId);
            if (current1RM > prevMax1RM && prevMax1RM > 0) {
                detectedPRs.push({
                    exerciseId: exId,
                    exerciseName: exName,
                    type: '1RM_ESTIMADO',
                    previousRecord: prevMax1RM,
                    newRecord: current1RM,
                    improvement: Math.round((current1RM - prevMax1RM) * 10) / 10,
                });
            }
        }
        const savedSession = await this.sessionRepo.save(session);
        return {
            session: savedSession,
            personalRecords: detectedPRs,
        };
    }
    async getSessionsByAthlete(athleteId) {
        return this.sessionRepo.findByAthleteId(athleteId);
    }
};
WorkoutSessionService = __decorate([
    Injectable(),
    __param(0, Inject(WORKOUT_SESSION_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object])
], WorkoutSessionService);
export { WorkoutSessionService };
//# sourceMappingURL=workout-session.service.js.map