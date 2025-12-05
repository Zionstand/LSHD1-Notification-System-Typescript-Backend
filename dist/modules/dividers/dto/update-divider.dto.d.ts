import { DividerStatus } from '../entities/divider.entity';
export declare class UpdateDividerDto {
    fullName?: string;
    phone?: string;
    address?: string;
    lga?: string;
    ward?: string;
    community?: string;
    notes?: string;
    status?: DividerStatus;
}
