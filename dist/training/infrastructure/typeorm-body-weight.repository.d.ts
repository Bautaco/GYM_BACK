import { Repository } from 'typeorm';
import { BodyWeightRecord } from '../domain/body-weight-record.entity.js';
import { IBodyWeightRepository } from '../domain/body-weight.repository.interface.js';
import { BodyWeightOrmEntity } from './body-weight.orm-entity.js';
export declare class TypeOrmBodyWeightRepository implements IBodyWeightRepository {
    private readonly repo;
    constructor(repo: Repository<BodyWeightOrmEntity>);
    private toDomain;
    private toOrm;
    save(record: BodyWeightRecord): Promise<BodyWeightRecord>;
    findByAthleteId(athleteId: string): Promise<BodyWeightRecord[]>;
}
