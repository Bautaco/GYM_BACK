export class ExerciseItem {
    id;
    exerciseId;
    exerciseName;
    targetSets;
    targetReps;
    targetWeightKg;
    restSeconds;
    notes;
    cadence;
    constructor(id, exerciseId, exerciseName, targetSets, targetReps, targetWeightKg, restSeconds, notes, cadence) {
        this.id = id;
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.targetSets = targetSets;
        this.targetReps = targetReps;
        this.targetWeightKg = targetWeightKg;
        this.restSeconds = restSeconds;
        this.notes = notes;
        this.cadence = cadence;
    }
}
//# sourceMappingURL=exercise-item.entity.js.map