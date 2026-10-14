var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class LoggedSetDto {
    exerciseId;
    exerciseName;
    setNumber;
    actualReps;
    actualWeightKg;
    isCompleted;
}
__decorate([
    IsNotEmpty({ message: 'El ID de ejercicio es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], LoggedSetDto.prototype, "exerciseId", void 0);
__decorate([
    IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], LoggedSetDto.prototype, "exerciseName", void 0);
__decorate([
    IsInt({ message: 'El número de serie debe ser entero' }),
    Min(1),
    __metadata("design:type", Number)
], LoggedSetDto.prototype, "setNumber", void 0);
__decorate([
    IsInt({ message: 'Las repeticiones reales deben ser un número entero' }),
    Min(0, { message: 'Las repeticiones no pueden ser negativas' }),
    __metadata("design:type", Number)
], LoggedSetDto.prototype, "actualReps", void 0);
__decorate([
    IsNumber({}, { message: 'El peso real levantado debe ser numérico' }),
    Min(0, { message: 'El peso levantado no puede ser un valor negativo' }),
    __metadata("design:type", Number)
], LoggedSetDto.prototype, "actualWeightKg", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], LoggedSetDto.prototype, "isCompleted", void 0);
export class LogWorkoutSessionDto {
    athleteId;
    trainingPlanId;
    routineId;
    routineName;
    date;
    completed;
    notes;
    rpe;
    sets;
}
__decorate([
    IsNotEmpty({ message: 'El ID del atleta es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], LogWorkoutSessionDto.prototype, "athleteId", void 0);
__decorate([
    IsNotEmpty({ message: 'El ID del plan es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], LogWorkoutSessionDto.prototype, "trainingPlanId", void 0);
__decorate([
    IsNotEmpty({ message: 'El ID de la rutina es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], LogWorkoutSessionDto.prototype, "routineId", void 0);
__decorate([
    IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], LogWorkoutSessionDto.prototype, "routineName", void 0);
__decorate([
    IsNotEmpty({ message: 'La fecha es obligatoria' }),
    IsDateString({}, { message: 'Formato de fecha inválido (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], LogWorkoutSessionDto.prototype, "date", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], LogWorkoutSessionDto.prototype, "completed", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], LogWorkoutSessionDto.prototype, "notes", void 0);
__decorate([
    IsOptional(),
    IsInt({ message: 'El RPE debe ser un número entero entre 1 y 10' }),
    Min(1, { message: 'El RPE mínimo es 1' }),
    Max(10, { message: 'El RPE máximo es 10' }),
    __metadata("design:type", Number)
], LogWorkoutSessionDto.prototype, "rpe", void 0);
__decorate([
    IsArray({ message: 'Debe enviar la lista de series ejecutadas' }),
    ValidateNested({ each: true }),
    Type(() => LoggedSetDto),
    __metadata("design:type", Array)
], LogWorkoutSessionDto.prototype, "sets", void 0);
//# sourceMappingURL=log-workout-session.dto.js.map