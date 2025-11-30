import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: {
                id: import("../users/entities/user.entity").UserRole;
                name: import("../users/entities/user.entity").UserRole;
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
            role: import("../users/entities/user.entity").UserRole;
            status: import("../users/entities/user.entity").UserStatus;
            firstName?: undefined;
            lastName?: undefined;
            facility?: undefined;
        };
        token?: undefined;
    }>;
    login(loginDto: LoginDto, ip: string, userAgent: string): Promise<{
        message: string;
        token: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: {
                id: import("../users/entities/user.entity").UserRole;
                name: import("../users/entities/user.entity").UserRole;
                level: number;
            };
            facility: {
                id: number;
                name: string;
            } | null;
        };
    }>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: {
            id: import("../users/entities/user.entity").UserRole;
            name: import("../users/entities/user.entity").UserRole;
        };
        facility: {
            id: number;
            name: string;
        } | null;
    }>;
}
