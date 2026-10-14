var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, } from 'typeorm';
let WorkoutSessionOrmEntity = class WorkoutSessionOrmEntity {
    id;
    athleteId;
    trainingPlanId;
    routineId;
    routineName;
    date;
    completed;
    notes;
    rpe;
    sets;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], WorkoutSessionOrmEntity.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], WorkoutSessionOrmEntity.prototype, "athleteId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], WorkoutSessionOrmEntity.prototype, "trainingPlanId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], WorkoutSessionOrmEntity.prototype, "routineId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], WorkoutSessionOrmEntity.prototype, "routineName", void 0);
__decorate([
    Column({ type: 'date' }),
    __metadata("design:type", String)
], WorkoutSessionOrmEntity.prototype, "date", void 0);
__decorate([
    Column({ default: true }),
    __metadata("design:type", Boolean)
], WorkoutSessionOrmEntity.prototype, "completed", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], WorkoutSessionOrmEntity.prototype, "notes", void 0);
__decorate([
    Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], WorkoutSessionOrmEntity.prototype, "rpe", void 0);
__decorate([
    OneToMany('LoggedSetOrmEntity', 'session', {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], WorkoutSessionOrmEntity.prototype, "sets", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], WorkoutSessionOrmEntity.prototype, "createdAt", void 0);
WorkoutSessionOrmEntity = __decorate([
    Entity('workout_sessions')
], WorkoutSessionOrmEntity);
export { WorkoutSessionOrmEntity };
//# sourceMappingURL=workout-session.orm-entity.js.map