import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BodyWeightRecord } from '../domain/body-weight-record.entity.js';
import { IBodyWeightRepository } from '../domain/body-weight.repository.interface.js';
import { BodyWeightOrmEntity } from './body-weight.orm-entity.js';

@Injectable()
export class TypeOrmBodyWeightRepository implements IBodyWeightRepository {
  constructor(
    @InjectRepository(BodyWeightOrmEntity)
    private readonly repo: Repository<BodyWeightOrmEntity>,
  ) {}

  private toDomain(orm: BodyWeightOrmEntity): BodyWeightRecord {
    return new BodyWeightRecord(
      orm.id,
      orm.athleteId,
      orm.weightKg,
      orm.recordedAt,
      orm.notes,
    );
  }

  private toOrm(domain: BodyWeightRecord): BodyWeightOrmEntity {
    const orm = new BodyWeightOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.athleteId = domain.athleteId;
    orm.weightKg = domain.weightKg;
    orm.recordedAt = domain.recordedAt || new Date();
    orm.notes = domain.notes;
    return orm;
  }

  async save(record: BodyWeightRecord): Promise<BodyWeightRecord> {
    const orm = this.toOrm(record);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findByAthleteId(athleteId: string): Promise<BodyWeightRecord[]> {
    const list = await this.repo.find({
      where: { athleteId },
      order: { recordedAt: 'ASC' },
    });
    return list.map((r) => this.toDomain(r));
  }
}
