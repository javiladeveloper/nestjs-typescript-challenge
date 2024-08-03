import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
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
    console.log('User object in PermissionsGuard:', user);

    if (!user) {
      console.log('PermissionsGuard: User is undefined');
      throw new UnauthorizedException('User is undefined');
    }

    const userEntity = await this.usersService.findOneById(user.id);
    if (!userEntity) {
      console.log('PermissionsGuard: User not found in database', user);
      throw new UnauthorizedException('User not found in database');
    }

    console.log('User entity in PermissionsGuard:', userEntity);
    if (!userEntity.roles) {
      console.log(
        'PermissionsGuard: User does not have roles assigned',
        userEntity,
      );
      throw new UnauthorizedException('User does not have roles assigned');
    }

    const hasPermission = requiredPermissions.some((permission) =>
      userEntity.roles.some((role) =>
        role.permissions.map((p) => p.name).includes(permission),
      ),
    );

    if (!hasPermission) {
      console.log(
        'PermissionsGuard: User does not have the required permissions',
        userEntity,
      );
      throw new UnauthorizedException(
        'User does not have the required permissions',
      );
    }

    return true;
  }
}
