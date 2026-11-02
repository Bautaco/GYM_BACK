export class TrainingPlan {
    id;
    name;
    athleteId;
    trainerId;
    startDate;
    endDate;
    isActive;
    routines;
    athleteName;
    trainerName;
    createdAt;
    frequencyPerWeek;
    sessionsPerDay;
    constructor(id, name, athleteId, trainerId, startDate, endDate, isActive, routines, athleteName, trainerName, createdAt, frequencyPerWeek = 3, sessionsPerDay = 1) {
        this.id = id;
        this.name = name;
        this.athleteId = athleteId;
        this.trainerId = trainerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.routines = routines;
        this.athleteName = athleteName;
        this.trainerName = trainerName;
        this.createdAt = createdAt;
        this.frequencyPerWeek = frequencyPerWeek;
        this.sessionsPerDay = sessionsPerDay;
    }
    deactivate() {
        this.isActive = false;
    }
    isCurrent() {
        const now = new Date();
        return this.isActive && this.startDate <= now && now <= this.endDate;
    }
}
//# sourceMappingURL=training-plan.entity.js.map