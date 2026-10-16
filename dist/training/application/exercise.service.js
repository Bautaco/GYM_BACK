var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EXERCISE_REPOSITORY_TOKEN } from '../domain/exercise.repository.interface.js';
import { Exercise } from '../domain/exercise.entity.js';
import { MuscleGroupOrmEntity } from '../infrastructure/muscle-group.orm-entity.js';
import { TargetZoneOrmEntity } from '../infrastructure/target-zone.orm-entity.js';
let ExerciseService = class ExerciseService {
    exerciseRepo;
    muscleGroupRepo;
    targetZoneRepo;
    constructor(exerciseRepo, muscleGroupRepo, targetZoneRepo) {
        this.exerciseRepo = exerciseRepo;
        this.muscleGroupRepo = muscleGroupRepo;
        this.targetZoneRepo = targetZoneRepo;
    }
    async getAllExercises() {
        return this.exerciseRepo.findAll();
    }
    async getExerciseById(id) {
        const found = await this.exerciseRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
        }
        return found;
    }
    async getMuscleGroups() {
        const dbGroups = await this.muscleGroupRepo.find({ order: { name: 'ASC' } });
        const groupSet = new Set(dbGroups.map((g) => g.name.trim()));
        const allExercises = await this.exerciseRepo.findAll();
        for (const ex of allExercises) {
            if (ex.grupoMuscularPrincipal && ex.grupoMuscularPrincipal.trim().length > 0) {
                groupSet.add(ex.grupoMuscularPrincipal.trim());
            }
        }
        const defaults = ['Piernas', 'Pecho', 'Espalda', 'Hombros', 'Brazos', 'Core'];
        for (const d of defaults) {
            groupSet.add(d);
        }
        return Array.from(groupSet).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    }
    async getTargetZones() {
        const dbZones = await this.targetZoneRepo.find({ order: { name: 'ASC' } });
        const zoneSet = new Set(dbZones.map((z) => z.name.trim()));
        const allExercises = await this.exerciseRepo.findAll();
        for (const ex of allExercises) {
            if (Array.isArray(ex.zonasTrabajadas)) {
                for (const z of ex.zonasTrabajadas) {
                    if (z && z.trim().length > 0) {
                        zoneSet.add(z.trim());
                    }
                }
            }
        }
        const defaults = [
            'Cuádriceps',
            'Glúteo Mayor',
            'Glúteo Medio',
            'Isquiotibiales',
            'Pectoral Mayor',
            'Pectoral Superior',
            'Deltoides Anterior',
            'Deltoides Lateral',
            'Deltoides Posterior',
            'Dorsal Ancho',
            'Trapecio',
            'Erectores Espinales',
            'Bíceps Braquial',
            'Tríceps Braquial',
            'Braquiorradial',
            'Abdomen',
            'Oblicuos',
            'Lumbares',
            'Aductores',
            'Gemelos',
        ];
        for (const d of defaults) {
            zoneSet.add(d);
        }
        return Array.from(zoneSet).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    }
    async ensureMuscleGroupAndZones(grupo, zonas) {
        const trimmedGroup = grupo?.trim();
        if (trimmedGroup) {
            const existing = await this.muscleGroupRepo.find();
            const match = existing.find((g) => g.name.trim().toLowerCase() === trimmedGroup.toLowerCase());
            if (!match) {
                const newGroup = this.muscleGroupRepo.create({ name: trimmedGroup });
                await this.muscleGroupRepo.save(newGroup);
            }
        }
        if (Array.isArray(zonas) && zonas.length > 0) {
            const existingZones = await this.targetZoneRepo.find();
            for (const rawZone of zonas) {
                const trimmedZone = rawZone?.trim();
                if (!trimmedZone)
                    continue;
                const match = existingZones.find((z) => z.name.trim().toLowerCase() === trimmedZone.toLowerCase());
                if (!match) {
                    const newZone = this.targetZoneRepo.create({
                        name: trimmedZone,
                        muscleGroupName: trimmedGroup,
                    });
                    await this.targetZoneRepo.save(newZone);
                }
            }
        }
    }
    async createMuscleGroup(name) {
        const trimmed = name?.trim();
        if (!trimmed)
            return '';
        await this.ensureMuscleGroupAndZones(trimmed, []);
        return trimmed;
    }
    async createTargetZone(name, muscleGroupName) {
        const trimmed = name?.trim();
        if (!trimmed)
            return '';
        const existing = await this.targetZoneRepo.find();
        const match = existing.find((z) => z.name.trim().toLowerCase() === trimmed.toLowerCase());
        if (!match) {
            const newZone = this.targetZoneRepo.create({
                name: trimmed,
                muscleGroupName: muscleGroupName?.trim(),
            });
            await this.targetZoneRepo.save(newZone);
        }
        return trimmed;
    }
    async createExercise(dto) {
        const trimmedGroup = dto.grupoMuscularPrincipal.trim();
        const zones = Array.isArray(dto.zonasTrabajadas)
            ? dto.zonasTrabajadas.map((z) => z.trim()).filter((z) => z.length > 0)
            : [];
        await this.ensureMuscleGroupAndZones(trimmedGroup, zones);
        const exercise = new Exercise('', dto.nombre.trim(), trimmedGroup, zones.length > 0 ? zones : [trimmedGroup], dto.descripcion.trim(), dto.videoUrl?.trim(), new Date());
        return this.exerciseRepo.save(exercise);
    }
    async updateExercise(id, dto) {
        const found = await this.exerciseRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
        }
        let group = found.grupoMuscularPrincipal;
        let zones = found.zonasTrabajadas;
        if (dto.nombre !== undefined)
            found.nombre = dto.nombre.trim();
        if (dto.grupoMuscularPrincipal !== undefined) {
            group = dto.grupoMuscularPrincipal.trim();
            found.grupoMuscularPrincipal = group;
        }
        if (dto.zonasTrabajadas !== undefined) {
            zones = dto.zonasTrabajadas.map((z) => z.trim()).filter((z) => z.length > 0);
            found.zonasTrabajadas = zones;
        }
        if (dto.descripcion !== undefined)
            found.descripcion = dto.descripcion.trim();
        if (dto.videoUrl !== undefined)
            found.videoUrl = dto.videoUrl?.trim() || undefined;
        await this.ensureMuscleGroupAndZones(group, zones || []);
        return this.exerciseRepo.save(found);
    }
    async deleteExercise(id) {
        const found = await this.exerciseRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
        }
        await this.exerciseRepo.delete(id);
    }
};
ExerciseService = __decorate([
    Injectable(),
    __param(0, Inject(EXERCISE_REPOSITORY_TOKEN)),
    __param(1, InjectRepository(MuscleGroupOrmEntity)),
    __param(2, InjectRepository(TargetZoneOrmEntity)),
    __metadata("design:paramtypes", [Object, Repository,
        Repository])
], ExerciseService);
export { ExerciseService };
//# sourceMappingURL=exercise.service.js.map