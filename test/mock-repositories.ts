import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Agent } from '../src/sales/models/agent.entity';
import { Customer } from '../src/sales/models/customer.entity';
import { Order } from '../src/sales/models/order.entity';
import { User } from '../src/users/models/user.entity';
import { Role } from '../src/roles/models/role.entity';
import { Permission } from '../src/permissions/models/permission.entity';

export const mockRepositories = () => {
  const customerRepository = mock<Repository<Customer>>();
  const agentRepository = mock<Repository<Agent>>();
  const orderRepository = mock<Repository<Order>>();
  const userRepository = mock<Repository<User>>();
  const roleRepository = mock<Repository<Role>>();
  const permissionRepository = mock<Repository<Permission>>();

  return {
    customerRepository,
    agentRepository,
    orderRepository,
    userRepository,
    roleRepository,
    permissionRepository,
  };
};
