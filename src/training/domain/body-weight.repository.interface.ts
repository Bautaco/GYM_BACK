import { BodyWeightRecord } from './body-weight-record.entity.js';

export interface IBodyWeightRepository {
  save(record: BodyWeightRecord): Promise<BodyWeightRecord>;
  findByAthleteId(athleteId: string): Promise<BodyWeightRecord[]>;
}

export const BODY_WEIGHT_REPOSITORY_TOKEN = 'IBodyWeightRepository';
