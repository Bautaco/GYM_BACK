var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseItemDto } from './create-training-plan.dto.js';
export class CreateRoutineTemplateDto {
    name;
    description;
    category;
    exerciseItems;
}
__decorate([
    IsNotEmpty({ message: 'El nombre de la plantilla es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], CreateRoutineTemplateDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateRoutineTemplateDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateRoutineTemplateDto.prototype, "category", void 0);
__decorate([
    IsArray({ message: 'Debe incluir al menos un ejercicio en la plantilla' }),
    ValidateNested({ each: true }),
    Type(() => ExerciseItemDto),
    __metadata("design:type", Array)
], CreateRoutineTemplateDto.prototype, "exerciseItems", void 0);
//# sourceMappingURL=create-routine-template.dto.js.map