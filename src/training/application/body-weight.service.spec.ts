import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BodyWeightService } from './body-weight.service.js';
import { BodyWeightRecord } from '../domain/body-weight-record.entity.js';
import { BadRequestException } from '@nestjs/common';

describe('BodyWeightService (Unit)', () => {
  let service: BodyWeightService;
  let mockBodyWeightRepo: any;

  beforeEach(() => {
    mockBodyWeightRepo = {
      save: vi.fn(),
      findByAthleteId: vi.fn(),
    };
    service = new BodyWeightService(mockBodyWeightRepo);
  });

  it('logWeight: registra exitosamente el peso corporal de un atleta', async () => {
    const savedRecord = new BodyWeightRecord('rec-1', 'ath-1', 75.5, new Date('2026-05-01'), 'En ayunas');
    mockBodyWeightRepo.save.mockResolvedValue(savedRecord);

    const result = await service.logWeight('ath-1', {
      weightKg: 75.5,
      notes: 'En ayunas',
    });

    expect(result.weightKg).toBe(75.5);
    expect(mockBodyWeightRepo.save).toHaveBeenCalled();
  });

  it('logWeight: lanza BadRequestException si el peso es igual a 0 kg', async () => {
    await expect(
      service.logWeight('ath-1', { weightKg: 0 }),
    ).rejects.toThrow(BadRequestException);
    expect(mockBodyWeightRepo.save).not.toHaveBeenCalled();
  });

  it('logWeight: lanza BadRequestException si el peso es negativo', async () => {
    await expect(
      service.logWeight('ath-1', { weightKg: -5 }),
    ).rejects.toThrow(BadRequestException);
    expect(mockBodyWeightRepo.save).not.toHaveBeenCalled();
  });

  it('getWeightHistory: retorna el historial de registros del atleta', async () => {
    const records = [
      new BodyWeightRecord('1', 'ath-1', 75, new Date('2026-01-01')),
      new BodyWeightRecord('2', 'ath-1', 76, new Date('2026-02-01')),
    ];
    mockBodyWeightRepo.findByAthleteId.mockResolvedValue(records);

    const result = await service.getWeightHistory('ath-1');
    expect(result).toHaveLength(2);
    expect(result[0].weightKg).toBe(75);
    expect(result[1].weightKg).toBe(76);
  });

  it('getWeightHistory: retorna un array vacío si el atleta no tiene registros previos', async () => {
    mockBodyWeightRepo.findByAthleteId.mockResolvedValue([]);

    const result = await service.getWeightHistory('new-ath');
    expect(result).toEqual([]);
  });
});
