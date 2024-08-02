import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from '../../permissions/models/permission.entity';
import { User } from '../../users/models/user.entity';

@Entity('roles') // Asegúrate de que el nombre de la tabla es 'roles'
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions_permission', // Nombre de la tabla intermedia
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: 'user_roles_role', // Nombre de la tabla intermedia
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
