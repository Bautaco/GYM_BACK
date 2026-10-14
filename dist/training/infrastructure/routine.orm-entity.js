var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, } from 'typeorm';
let RoutineOrmEntity = class RoutineOrmEntity {
    id;
    name;
    dayOfWeek;
    description;
    trainingPlan;
    trainingPlanId;
    exerciseItems;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], RoutineOrmEntity.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], RoutineOrmEntity.prototype, "name", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], RoutineOrmEntity.prototype, "dayOfWeek", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], RoutineOrmEntity.prototype, "description", void 0);
__decorate([
    ManyToOne('TrainingPlanOrmEntity', 'routines', {
        onDelete: 'CASCADE',
    }),
    JoinColumn({ name: 'trainingPlanId' }),
    __metadata("design:type", Function)
], RoutineOrmEntity.prototype, "trainingPlan", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], RoutineOrmEntity.prototype, "trainingPlanId", void 0);
__decorate([
    OneToMany('ExerciseItemOrmEntity', 'routine', {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], RoutineOrmEntity.prototype, "exerciseItems", void 0);
RoutineOrmEntity = __decorate([
    Entity('routines')
], RoutineOrmEntity);
export { RoutineOrmEntity };
//# sourceMappingURL=routine.orm-entity.js.map