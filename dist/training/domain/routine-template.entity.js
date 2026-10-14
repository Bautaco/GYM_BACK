export class RoutineTemplate {
    id;
    trainerId;
    name;
    description;
    category;
    exerciseItems;
    createdAt;
    constructor(id, trainerId, name, description, category, exerciseItems = [], createdAt) {
        this.id = id;
        this.trainerId = trainerId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.exerciseItems = exerciseItems;
        this.createdAt = createdAt;
    }
}
//# sourceMappingURL=routine-template.entity.js.map