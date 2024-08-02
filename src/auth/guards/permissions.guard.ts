import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { User } from '../../users/models/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.roles) {
      throw new UnauthorizedException('User does not have roles assigned');
    }

    return requiredPermissions.some((permission) =>
      user.roles.some((role) =>
        role.permissions.map((p) => p.name).includes(permission),
      ),
    );
  }
}
