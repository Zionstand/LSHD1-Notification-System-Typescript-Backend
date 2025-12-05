import { DividersService } from './dividers.service';
import { CreateDividerDto } from './dto/create-divider.dto';
import { UpdateDividerDto } from './dto/update-divider.dto';
export declare class DividersController {
    private readonly dividersService;
    constructor(dividersService: DividersService);
    create(createDividerDto: CreateDividerDto, req: any): Promise<{
        message: string;
        divider: {
            id: any;
            dividerCode: any;
            fullName: any;
            phone: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            notes: any;
            status: any;
            facility: {
                id: any;
                name: any;
            } | null;
            capturedBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    findAll(req: any, status?: string, search?: string, limit?: string, offset?: string): Promise<{
        total: number;
        dividers: {
            id: any;
            dividerCode: any;
            fullName: any;
            phone: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            notes: any;
            status: any;
            facility: {
                id: any;
                name: any;
            } | null;
            capturedBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        }[];
    }>;
    getStats(req: any): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
    findOne(id: number): Promise<{
        id: any;
        dividerCode: any;
        fullName: any;
        phone: any;
        address: any;
        lga: any;
        ward: any;
        community: any;
        notes: any;
        status: any;
        facility: {
            id: any;
            name: any;
        } | null;
        capturedBy: {
            id: any;
            name: any;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    update(id: number, updateDividerDto: UpdateDividerDto): Promise<{
        message: string;
        divider: {
            id: any;
            dividerCode: any;
            fullName: any;
            phone: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            notes: any;
            status: any;
            facility: {
                id: any;
                name: any;
            } | null;
            capturedBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    deactivate(id: number): Promise<{
        message: string;
        divider: {
            id: any;
            dividerCode: any;
            fullName: any;
            phone: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            notes: any;
            status: any;
            facility: {
                id: any;
                name: any;
            } | null;
            capturedBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    activate(id: number): Promise<{
        message: string;
        divider: {
            id: any;
            dividerCode: any;
            fullName: any;
            phone: any;
            address: any;
            lga: any;
            ward: any;
            community: any;
            notes: any;
            status: any;
            facility: {
                id: any;
                name: any;
            } | null;
            capturedBy: {
                id: any;
                name: any;
            } | null;
            createdAt: any;
            updatedAt: any;
        };
    }>;
    private formatDivider;
}
