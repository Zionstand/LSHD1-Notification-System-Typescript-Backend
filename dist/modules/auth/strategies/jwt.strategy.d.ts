import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
interface JwtPayload {
    id: number;
    email: string;
    role: string;
    facility_id: number | null;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        email: string;
        role: string;
        facility_id: number | null;
    }>;
}
export {};
