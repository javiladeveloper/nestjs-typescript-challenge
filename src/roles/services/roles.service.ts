import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../models/role.entity';
import { Permission } from '../../permissions/models/permission.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {
    this.logger.log('RolesService initialized');
  }

  async createRole(name: string, permissions: string[]): Promise<Role> {
    this.logger.log(`Creating role with name: ${name}`);
    const role = this.rolesRepository.create({ name });
    role.permissions = await this.permissionsRepository.findBy({
      id: In(permissions),
    });
    const savedRole = await this.rolesRepository.save(role);
    this.logger.log(`Role created successfully with ID: ${savedRole.id}`);
    return savedRole;
  }

  async addPermissionToRole(
    roleId: number,
    permissionName: string,
  ): Promise<Role> {
    this.logger.log(
      `Adding permission "${permissionName}" to role ID: ${roleId}`,
    );
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      this.logger.warn(`Role not found with ID: ${roleId}`);
      throw new Error('Role not found');
    }

    const permission = await this.permissionsRepository.findOne({
      where: { name: permissionName },
    });

    if (!permission) {
      this.logger.warn(`Permission not found with name: ${permissionName}`);
      throw new Error('Permission not found');
    }

    role.permissions.push(permission);
    const updatedRole = await this.rolesRepository.save(role);
    this.logger.log(
      `Permission "${permissionName}" added to role ID: ${roleId}`,
    );
    return updatedRole;
  }
}
