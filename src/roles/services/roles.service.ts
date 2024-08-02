import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../models/role.entity';
import { Permission } from '../../permissions/models/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async createRole(name: string, permissions: string[]): Promise<Role> {
    const role = this.rolesRepository.create({ name });
    role.permissions = await this.permissionsRepository.findBy({
      id: In(permissions),
    });
    return this.rolesRepository.save(role);
  }

  async addPermissionToRole(
    roleId: number,
    permissionName: string,
  ): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['roles'],
    });
    const permission = await this.permissionsRepository.findOne({
      where: { name: permissionName },
    });
    role.permissions.push(permission);
    return this.rolesRepository.save(role);
  }
}
