var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
let ExerciseOrmEntity = class ExerciseOrmEntity {
    id;
    nombre;
    grupoMuscularPrincipal;
    zonasTrabajadas;
    descripcion;
    videoUrl;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ExerciseOrmEntity.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ExerciseOrmEntity.prototype, "nombre", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ExerciseOrmEntity.prototype, "grupoMuscularPrincipal", void 0);
__decorate([
    Column('simple-json'),
    __metadata("design:type", Array)
], ExerciseOrmEntity.prototype, "zonasTrabajadas", void 0);
__decorate([
    Column('text'),
    __metadata("design:type", String)
], ExerciseOrmEntity.prototype, "descripcion", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], ExerciseOrmEntity.prototype, "videoUrl", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], ExerciseOrmEntity.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], ExerciseOrmEntity.prototype, "updatedAt", void 0);
ExerciseOrmEntity = __decorate([
    Entity('exercises')
], ExerciseOrmEntity);
export { ExerciseOrmEntity };
//# sourceMappingURL=exercise.orm-entity.js.map