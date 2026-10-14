import { BodyWeightService } from '../application/body-weight.service.js';
import { LogBodyWeightDto } from './dtos/log-body-weight.dto.js';
export declare class BodyWeightController {
    private readonly bodyWeightService;
    constructor(bodyWeightService: BodyWeightService);
    logWeight(athleteId: string, dto: LogBodyWeightDto): Promise<import("../domain/body-weight-record.entity.js").BodyWeightRecord>;
    getWeightHistory(athleteId: string): Promise<import("../domain/body-weight-record.entity.js").BodyWeightRecord[]>;
}
