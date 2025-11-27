import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        role: import("./entities/user.entity").UserRole;
        facility: string | null;
        createdAt: Date;
    }[]>;
}
