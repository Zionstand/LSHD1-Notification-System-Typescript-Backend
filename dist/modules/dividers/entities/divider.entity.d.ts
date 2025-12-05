import { User } from '../../users/entities/user.entity';
import { PhcCenter } from '../../facilities/entities/phc-center.entity';
export type DividerStatus = 'active' | 'inactive';
export declare class Divider {
    id: number;
    dividerCode: string;
    fullName: string;
    phone: string | null;
    address: string | null;
    lga: string | null;
    ward: string | null;
    community: string | null;
    notes: string | null;
    status: DividerStatus;
    phcCenterId: number | null;
    capturedBy: number;
    createdAt: Date;
    updatedAt: Date;
    phcCenter: PhcCenter;
    capturedByUser: User;
}
