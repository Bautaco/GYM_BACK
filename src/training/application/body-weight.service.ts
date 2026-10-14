import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IBodyWeightRepository,
  BODY_WEIGHT_REPOSITORY_TOKEN,
} from '../domain/body-weight.repository.interface.js';
import { BodyWeightRecord } from '../domain/body-weight-record.entity.js';
import { LogBodyWeightDto } from '../presentation/dtos/log-body-weight.dto.js';

@Injectable()
export class BodyWeightService {
  constructor(
    @Inject(BODY_WEIGHT_REPOSITORY_TOKEN)
    private readonly bodyWeightRepo: IBodyWeightRepository,
  ) {}

  async logWeight(athleteId: string, dto: LogBodyWeightDto): Promise<BodyWeightRecord> {
    if (dto.weightKg <= 0) {
      throw new BadRequestException('El peso corporal debe ser mayor a 0 kg');
    }

    const record = new BodyWeightRecord(
      '',
      athleteId,
      Number(dto.weightKg),
      new Date(),
      dto.notes?.trim(),
    );

    return this.bodyWeightRepo.save(record);
  }

  async getWeightHistory(athleteId: string): Promise<BodyWeightRecord[]> {
    return this.bodyWeightRepo.findByAthleteId(athleteId);
  }
}
