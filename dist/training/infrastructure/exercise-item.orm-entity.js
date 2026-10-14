var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
let ExerciseItemOrmEntity = class ExerciseItemOrmEntity {
    id;
    exerciseId;
    exerciseName;
    targetSets;
    targetReps;
    targetWeightKg;
    restSeconds;
    notes;
    cadence;
    routine;
    routineId;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ExerciseItemOrmEntity.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ExerciseItemOrmEntity.prototype, "exerciseId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ExerciseItemOrmEntity.prototype, "exerciseName", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], ExerciseItemOrmEntity.prototype, "targetSets", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], ExerciseItemOrmEntity.prototype, "targetReps", void 0);
__decorate([
    Column('float'),
    __metadata("design:type", Number)
], ExerciseItemOrmEntity.prototype, "targetWeightKg", void 0);
__decorate([
    Column('int', { nullable: true }),
    __metadata("design:type", Number)
], ExerciseItemOrmEntity.prototype, "restSeconds", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], ExerciseItemOrmEntity.prototype, "notes", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], ExerciseItemOrmEntity.prototype, "cadence", void 0);
__decorate([
    ManyToOne('RoutineOrmEntity', 'exerciseItems', {
        onDelete: 'CASCADE',
    }),
    JoinColumn({ name: 'routineId' }),
    __metadata("design:type", Function)
], ExerciseItemOrmEntity.prototype, "routine", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ExerciseItemOrmEntity.prototype, "routineId", void 0);
ExerciseItemOrmEntity = __decorate([
    Entity('exercise_items')
], ExerciseItemOrmEntity);
export { ExerciseItemOrmEntity };
//# sourceMappingURL=exercise-item.orm-entity.js.map