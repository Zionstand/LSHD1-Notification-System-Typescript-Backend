import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuditService } from '../audit/audit.service';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private auditService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, auditService: AuditService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: {
                id: UserRole;
                name: UserRole;
                level: number;
            };
            facility: null;
            fullName?: undefined;
            status?: undefined;
        };
    } | {
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: UserRole;
            status: import("../users/entities/user.entity").UserStatus;
            firstName?: undefined;
            lastName?: undefined;
            facility?: undefined;
        };
        token?: undefined;
    }>;
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: {
                id: UserRole;
                name: UserRole;
                level: number;
            };
            facility: {
                id: number;
                name: string;
            } | null;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: {
            id: UserRole;
            name: UserRole;
        };
        facility: {
            id: number;
            name: string;
        } | null;
    }>;
}
