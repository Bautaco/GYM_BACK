var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
export class CreateExerciseDto {
    nombre;
    grupoMuscularPrincipal;
    zonasTrabajadas;
    descripcion;
    videoUrl;
}
__decorate([
    IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "nombre", void 0);
__decorate([
    IsNotEmpty({ message: 'El grupo muscular principal es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "grupoMuscularPrincipal", void 0);
__decorate([
    IsArray({ message: 'Las zonas trabajadas deben ser una lista' }),
    IsNotEmpty({ message: 'Debe especificar al menos una zona trabajada' }),
    __metadata("design:type", Array)
], CreateExerciseDto.prototype, "zonasTrabajadas", void 0);
__decorate([
    IsNotEmpty({ message: 'La descripción técnica es obligatoria' }),
    IsString(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "descripcion", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExerciseDto.prototype, "videoUrl", void 0);
//# sourceMappingURL=create-exercise.dto.js.map