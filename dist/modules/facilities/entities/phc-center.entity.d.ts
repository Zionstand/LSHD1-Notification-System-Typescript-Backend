export type PhcCenterStatus = 'active' | 'inactive';
export declare class PhcCenter {
    id: number;
    centerName: string;
    address: string;
    phone: string;
    email: string;
    lga: string;
    status: PhcCenterStatus;
    createdAt: Date;
}
