var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
export class LogBodyWeightDto {
    weightKg;
    notes;
}
__decorate([
    IsNotEmpty({ message: 'El peso en kilogramos es obligatorio' }),
    IsNumber({}, { message: 'El peso debe ser un número válido' }),
    IsPositive({ message: 'El peso debe ser mayor a 0 kg' }),
    __metadata("design:type", Number)
], LogBodyWeightDto.prototype, "weightKg", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], LogBodyWeightDto.prototype, "notes", void 0);
//# sourceMappingURL=log-body-weight.dto.js.map