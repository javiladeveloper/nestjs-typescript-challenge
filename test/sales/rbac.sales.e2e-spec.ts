import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { SalesModule } from '../../src/sales/sales.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agent } from '../../src/sales/models/agent.entity';
import { Customer } from '../../src/sales/models/customer.entity';
import { Order } from '../../src/sales/models/order.entity';
import { User } from '../../src/users/models/user.entity';
import { Role } from '../../src/roles/models/role.entity';
import { Permission } from '../../src/permissions/models/permission.entity';
import * as helper from '../data-helper';

jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };
});

describe('RBAC SalesController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModuleBuilder;

  const mockUserRepository = (user) => ({
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve(user);
    }),
  });

  beforeEach(async () => {
    moduleFixture = Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
        SalesModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Agent))
      .useValue({})
      .overrideProvider(getRepositoryToken(Customer))
      .useValue({})
      .overrideProvider(getRepositoryToken(Order))
      .useValue({})
      .overrideProvider(getRepositoryToken(Role))
      .useValue({})
      .overrideProvider(getRepositoryToken(Permission))
      .useValue({});
  });

  async function getValidToken(user) {
    moduleFixture
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository(user));
    app = (await moduleFixture.compile()).createNestApplication();
    await app.init();

    const {
      body: { access_token },
    } = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: user.email,
      password: 'demo',
    });

    return access_token;
  }

  it('should fail to GET /api/agents because the customer role does not have access', async () => {
    const token = await getValidToken(helper.userCustomer);

    return request(app.getHttpServer())
      .get('/api/agents')
      .auth(token, {
        type: 'bearer',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  it('should fail to GET /api/customers because the agent role does not have access', async () => {
    const token = await getValidToken(helper.userAgent);

    return request(app.getHttpServer())
      .get('/api/customers')
      .auth(token, {
        type: 'bearer',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  it('should fail to GET /api/orders/total-amount-by-customer because the agent role does not have access', async () => {
    const token = await getValidToken(helper.userGuest);

    return request(app.getHttpServer())
      .get('/api/orders/total-amount-by-customer')
      .auth(token, {
        type: 'bearer',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  it('should fail to GET /api/orders/total-amount-by-agent because the customer role does not have access', async () => {
    const token = await getValidToken(helper.userGuest);

    return request(app.getHttpServer())
      .get('/api/orders/total-amount-by-agent')
      .auth(token, {
        type: 'bearer',
      })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  afterEach(async () => {
    await app.close();
  });
});
