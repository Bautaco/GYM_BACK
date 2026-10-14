var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, } from 'typeorm';
let TrainingPlanOrmEntity = class TrainingPlanOrmEntity {
    id;
    name;
    athleteId;
    trainerId;
    athleteName;
    trainerName;
    startDate;
    endDate;
    isActive;
    routines;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "athleteId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "trainerId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "athleteName", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "trainerName", void 0);
__decorate([
    Column({ type: 'date' }),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "startDate", void 0);
__decorate([
    Column({ type: 'date' }),
    __metadata("design:type", String)
], TrainingPlanOrmEntity.prototype, "endDate", void 0);
__decorate([
    Column({ default: true }),
    __metadata("design:type", Boolean)
], TrainingPlanOrmEntity.prototype, "isActive", void 0);
__decorate([
    OneToMany('RoutineOrmEntity', 'trainingPlan', {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], TrainingPlanOrmEntity.prototype, "routines", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], TrainingPlanOrmEntity.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], TrainingPlanOrmEntity.prototype, "updatedAt", void 0);
TrainingPlanOrmEntity = __decorate([
    Entity('training_plans')
], TrainingPlanOrmEntity);
export { TrainingPlanOrmEntity };
//# sourceMappingURL=training-plan.orm-entity.js.map