export const userCustomer = {
  id: '4',
  firstName: 'karina',
  lastName: 'bizarro',
  email: 'karina_bizarro@gmail.com',
  password: '$2a$10$SmgsS.iiGzFYvWLdhuR6qOfxCXgUn91Ks3nh1OMm.bzPojooEkhSS',
  createAt: '2024-08-02T22:45:41.248Z',
  updateAt: '2024-08-02T22:45:41.248Z',
  deletedAt: null,
  roles: [
    {
      roleId: '3',
      roleName: 'customer',
      permissions: [
        { id: 5, name: 'create_customer' },
        { id: 6, name: 'read_customer' },
        { id: 7, name: 'update_customer' },
        { id: 8, name: 'delete_customer' },
        { id: 9, name: 'create_order' },
        { id: 10, name: 'read_order' },
        { id: 11, name: 'update_order' },
        { id: 12, name: 'delete_order' },
      ],
    },
  ],
};

export const userAdmin = {
  id: '1',
  firstName: 'jonathan',
  lastName: 'avila',
  email: 'jonathan.joan.avila@gmail.com',
  password: '$2a$10$YqSMZMt6T78JUWjvyp9gpOx3KbhuA6bRDEItUqNT1A5NyDAWhiMAi',
  createAt: '2024-08-02T01:49:01.159Z',
  updateAt: '2024-08-02T01:49:01.159Z',
  deletedAt: null,
  roles: [
    {
      roleId: 4,
      roleName: 'admin',
      permissions: [
        { id: 1, name: 'create_agent' },
        { id: 2, name: 'read_agent' },
        { id: 3, name: 'update_agent' },
        { id: 4, name: 'delete_agent' },
        { id: 5, name: 'create_customer' },
        { id: 6, name: 'read_customer' },
        { id: 7, name: 'update_customer' },
        { id: 8, name: 'delete_customer' },
        { id: 9, name: 'create_order' },
        { id: 10, name: 'read_order' },
        { id: 11, name: 'update_order' },
        { id: 12, name: 'delete_order' },
        { id: 13, name: 'assign_role' },
        { id: 14, name: 'create_user' },
        { id: 15, name: 'update_user' },
        { id: 16, name: 'delete_user' },
      ],
    },
  ],
};

export const userAgent = {
  id: '7',
  firstName: 'rocky',
  lastName: 'Avila',
  email: 'rocky@gmail.com',
  password: '$2a$10$tdi5iI/6ni0Kwujsy/5ioOkWvEmSkXFufkqsD7wr2.ZHUGeLJ78I6',
  createAt: '2024-08-03T01:18:39.368Z',
  updateAt: '2024-08-03T01:18:39.368Z',
  deletedAt: null,
  roles: [
    {
      roleId: '2',
      roleName: 'agent',
      permissions: [
        { id: 1, name: 'create_agent' },
        { id: 2, name: 'read_agent' },
        { id: 3, name: 'update_agent' },
        { id: 4, name: 'delete_agent' },
        { id: 9, name: 'create_order' },
        { id: 10, name: 'read_order' },
        { id: 11, name: 'update_order' },
        { id: 12, name: 'delete_order' },
      ],
    },
  ],
};

export const userGuest = {
  id: '6',
  firstName: 'maxito',
  lastName: 'Avila',
  email: 'maxito@gmail.com',
  password: '$2a$10$g9kVXtnP9FRysQHwx.4qAuNc9HFw5SNZ7tvIHENiH7ax3v20xWdl6',
  createAt: '2024-08-03T01:16:40.623Z',
  updateAt: '2024-08-03T01:16:40.623Z',
  deletedAt: null,
  roles: [
    {
      roleId: '1',
      roleName: 'guest',
      permissions: [],
    },
  ],
};
