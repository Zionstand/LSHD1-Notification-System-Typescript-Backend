import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
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
    login(loginDto: LoginDto): Promise<{
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
