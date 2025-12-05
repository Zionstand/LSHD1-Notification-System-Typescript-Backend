import { Repository } from 'typeorm';
import { Divider } from './entities/divider.entity';
import { CreateDividerDto } from './dto/create-divider.dto';
import { UpdateDividerDto } from './dto/update-divider.dto';
export declare class DividersService {
    private dividersRepository;
    private readonly logger;
    constructor(dividersRepository: Repository<Divider>);
    private generateDividerCode;
    create(createDividerDto: CreateDividerDto, capturedBy: number, phcCenterId?: number): Promise<Divider>;
    findAll(filters?: {
        phcCenterId?: number;
        status?: string;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        dividers: Divider[];
        total: number;
    }>;
    findOne(id: number): Promise<Divider>;
    update(id: number, updateDividerDto: UpdateDividerDto): Promise<Divider>;
    deactivate(id: number): Promise<Divider>;
    activate(id: number): Promise<Divider>;
    getStats(phcCenterId?: number): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
}
