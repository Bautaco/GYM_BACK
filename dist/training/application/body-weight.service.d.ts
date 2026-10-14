import { IBodyWeightRepository } from '../domain/body-weight.repository.interface.js';
import { BodyWeightRecord } from '../domain/body-weight-record.entity.js';
import { LogBodyWeightDto } from '../presentation/dtos/log-body-weight.dto.js';
export declare class BodyWeightService {
    private readonly bodyWeightRepo;
    constructor(bodyWeightRepo: IBodyWeightRepository);
    logWeight(athleteId: string, dto: LogBodyWeightDto): Promise<BodyWeightRecord>;
    getWeightHistory(athleteId: string): Promise<BodyWeightRecord[]>;
}
