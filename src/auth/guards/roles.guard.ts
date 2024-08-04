import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { User } from '../../users/models/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn('User is undefined');
      return false;
    }

    const hasRole = requiredRoles.some((role) =>
      user.roles.map((r) => r.name).includes(role),
    );

    if (!hasRole) {
      this.logger.warn(`User ${user.email} does not have the required roles`);
      return false;
    }

    this.logger.log(`User ${user.email} has the required roles`);
    return true;
  }
}
