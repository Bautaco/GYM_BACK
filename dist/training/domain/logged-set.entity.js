export class LoggedSet {
    id;
    exerciseId;
    exerciseName;
    setNumber;
    actualReps;
    actualWeightKg;
    isCompleted;
    constructor(id, exerciseId, exerciseName, setNumber, actualReps, actualWeightKg, isCompleted) {
        this.id = id;
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.setNumber = setNumber;
        this.actualReps = actualReps;
        this.actualWeightKg = actualWeightKg;
        this.isCompleted = isCompleted;
        if (actualWeightKg < 0) {
            throw new Error('El peso levantado no puede ser un valor negativo');
        }
        if (actualReps < 0) {
            throw new Error('Las repeticiones no pueden ser un valor negativo');
        }
    }
}
//# sourceMappingURL=logged-set.entity.js.map