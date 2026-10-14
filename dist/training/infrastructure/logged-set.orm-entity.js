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
let LoggedSetOrmEntity = class LoggedSetOrmEntity {
    id;
    exerciseId;
    exerciseName;
    setNumber;
    actualReps;
    actualWeightKg;
    isCompleted;
    session;
    sessionId;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], LoggedSetOrmEntity.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], LoggedSetOrmEntity.prototype, "exerciseId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], LoggedSetOrmEntity.prototype, "exerciseName", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], LoggedSetOrmEntity.prototype, "setNumber", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], LoggedSetOrmEntity.prototype, "actualReps", void 0);
__decorate([
    Column('float'),
    __metadata("design:type", Number)
], LoggedSetOrmEntity.prototype, "actualWeightKg", void 0);
__decorate([
    Column({ default: true }),
    __metadata("design:type", Boolean)
], LoggedSetOrmEntity.prototype, "isCompleted", void 0);
__decorate([
    ManyToOne('WorkoutSessionOrmEntity', 'sets', {
        onDelete: 'CASCADE',
    }),
    JoinColumn({ name: 'sessionId' }),
    __metadata("design:type", Function)
], LoggedSetOrmEntity.prototype, "session", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], LoggedSetOrmEntity.prototype, "sessionId", void 0);
LoggedSetOrmEntity = __decorate([
    Entity('logged_sets')
], LoggedSetOrmEntity);
export { LoggedSetOrmEntity };
//# sourceMappingURL=logged-set.orm-entity.js.map