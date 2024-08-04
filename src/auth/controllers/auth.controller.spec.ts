import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './../services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/services/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;

  const mockAuthService = {
    userExists: jest.fn(),
    createUser: jest.fn(),
    login: jest.fn(),
    assignRole: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        PermissionsGuard,
        JwtAuthGuard,
        Reflector,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'email@demo.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = {
        user_id: 1,
        access_token: 'token',
      };

      mockAuthService.userExists.mockResolvedValue(false);
      mockAuthService.createUser.mockResolvedValue(result);

      expect(await authController.register(createUserDto)).toEqual(result);
    });

    it('should throw an error if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'email@demo.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockAuthService.userExists.mockResolvedValue(true);

      await expect(authController.register(createUserDto)).rejects.toThrow(
        new HttpException('USER_ALREADY_REGISTERED', HttpStatus.CONFLICT),
      );
    });
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const req = {
        user: {
          email: 'email@demo.com',
          password: 'password',
        },
      };
      const result = {
        access_token: 'token',
      };

      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(req)).toEqual(result);
    });
  });

  describe('assignRole', () => {
    it('should assign a role to a user successfully', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 1,
        roleName: 'admin',
      };
      const result = {
        user_id: '1',
        new_role: 'admin',
      };

      mockAuthService.assignRole.mockResolvedValue(result);

      expect(await authController.assignRole(assignRoleDto)).toEqual(result);
    });

    it('should throw an error if the user is not found', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 1,
        roleName: 'admin',
      };

      mockAuthService.assignRole.mockImplementation(() => {
        throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
      });

      await expect(authController.assignRole(assignRoleDto)).rejects.toThrow(
        new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the role is not found', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: 1,
        roleName: 'admin',
      };

      mockAuthService.assignRole.mockImplementation(() => {
        throw new HttpException('ROLE_NOT_FOUND', HttpStatus.NOT_FOUND);
      });

      await expect(authController.assignRole(assignRoleDto)).rejects.toThrow(
        new HttpException('ROLE_NOT_FOUND', HttpStatus.NOT_FOUND),
      );
    });
  });
});
