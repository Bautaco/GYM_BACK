var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class ExerciseItemDto {
    exerciseId;
    exerciseName;
    targetSets;
    targetReps;
    targetWeightKg;
    restSeconds;
    notes;
    cadence;
}
__decorate([
    IsNotEmpty({ message: 'El ID de ejercicio es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], ExerciseItemDto.prototype, "exerciseId", void 0);
__decorate([
    IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], ExerciseItemDto.prototype, "exerciseName", void 0);
__decorate([
    IsInt({ message: 'Las series deben ser un entero' }),
    Min(1, { message: 'Debe tener al menos 1 serie' }),
    __metadata("design:type", Number)
], ExerciseItemDto.prototype, "targetSets", void 0);
__decorate([
    IsInt({ message: 'Las repeticiones deben ser un entero' }),
    Min(1, { message: 'Debe tener al menos 1 repetición' }),
    __metadata("design:type", Number)
], ExerciseItemDto.prototype, "targetReps", void 0);
__decorate([
    IsNumber({}, { message: 'La carga objetivo debe ser un número' }),
    Min(0, { message: 'La carga objetivo no puede ser negativa' }),
    __metadata("design:type", Number)
], ExerciseItemDto.prototype, "targetWeightKg", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    __metadata("design:type", Number)
], ExerciseItemDto.prototype, "restSeconds", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ExerciseItemDto.prototype, "notes", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ExerciseItemDto.prototype, "cadence", void 0);
export class RoutineDto {
    name;
    dayOfWeek;
    description;
    exerciseItems;
}
__decorate([
    IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], RoutineDto.prototype, "name", void 0);
__decorate([
    IsInt({ message: 'El día de la semana debe ser un número entero (1-7)' }),
    __metadata("design:type", Number)
], RoutineDto.prototype, "dayOfWeek", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], RoutineDto.prototype, "description", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ExerciseItemDto),
    __metadata("design:type", Array)
], RoutineDto.prototype, "exerciseItems", void 0);
export class CreateTrainingPlanDto {
    name;
    athleteId;
    startDate;
    endDate;
    routines;
}
__decorate([
    IsNotEmpty({ message: 'El nombre del plan de entrenamiento es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], CreateTrainingPlanDto.prototype, "name", void 0);
__decorate([
    IsNotEmpty({ message: 'El ID del atleta es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], CreateTrainingPlanDto.prototype, "athleteId", void 0);
__decorate([
    IsNotEmpty({ message: 'La fecha de inicio es obligatoria' }),
    IsDateString({}, { message: 'La fecha de inicio debe tener formato YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateTrainingPlanDto.prototype, "startDate", void 0);
__decorate([
    IsNotEmpty({ message: 'La fecha de finalización es obligatoria' }),
    IsDateString({}, { message: 'La fecha de fin debe tener formato YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateTrainingPlanDto.prototype, "endDate", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => RoutineDto),
    __metadata("design:type", Array)
], CreateTrainingPlanDto.prototype, "routines", void 0);
//# sourceMappingURL=create-training-plan.dto.js.map