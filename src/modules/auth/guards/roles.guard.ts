import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLE_HIERARCHY } from '../constants/roles.constant';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: No user role found');
    }

    const userRole = user.role as Role;
    const userAllowedRoles = ROLE_HIERARCHY[userRole] || [userRole];

    // Check if user's role (or any role they can assume via hierarchy) matches required roles
    const hasRole = requiredRoles.some((role) =>
      userAllowedRoles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
