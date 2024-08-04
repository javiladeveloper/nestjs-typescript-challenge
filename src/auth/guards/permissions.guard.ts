import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('User is undefined');
      throw new UnauthorizedException('User is undefined');
    }

    const userEntity = await this.usersService.findOneById(user.id);

    if (!userEntity.roles || userEntity.roles.length === 0) {
      this.logger.warn(`User ${user.email} does not have roles assigned`);
      throw new UnauthorizedException('User does not have roles assigned');
    }

    const hasPermission = requiredPermissions.some((permission) =>
      userEntity.roles.some((role) =>
        role.permissions.map((p) => p.name).includes(permission),
      ),
    );

    if (!hasPermission) {
      this.logger.warn(
        `User ${user.email} does not have the required permissions`,
      );
      throw new UnauthorizedException(
        'User does not have the required permissions',
      );
    }

    this.logger.log(`User ${user.email} has the required permissions`);
    return true;
  }
}
