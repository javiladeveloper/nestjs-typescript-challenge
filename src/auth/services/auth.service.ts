/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from './../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './../../users/models/user.entity';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { AssignRoleDto } from '../controllers/dto/assign-role.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.logger.log('AuthService initialized');
  }

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.log(`Validating user with email: ${email}`);
    const user: User = await this.usersService.findOneByEmail(email);
    if (
      user &&
      (await this.usersService.comparePassword(pass, user.password))
    ) {
      this.logger.log(`User validated successfully with email: ${email}`);
      const { password, ...result } = user;
      return result;
    }
    this.logger.warn(`User validation failed for email: ${email}`);
    return null;
  }

  async login(user: User) {
    this.logger.log(`Logging in user with email: ${user.email}`);
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    this.logger.log(`User logged in successfully with email: ${user.email}`);
    return {
      access_token: token,
    };
  }

  async userExists(email: string): Promise<boolean> {
    this.logger.log(`Checking if user exists with email: ${email}`);
    const user = await this.usersService.findOneByEmail(email);
    const exists = !!user;
    this.logger.log(`User exists with email: ${email} - ${exists}`);
    return exists;
  }

  async createUser(userDto: CreateUserDto) {
    const { password, ...loggableUserDto } = userDto;
    this.logger.log('Creating a new user', JSON.stringify(loggableUserDto));
    const user: User = await this.usersService.create(userDto);
    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    this.logger.log(`User created successfully with ID: ${user.id}`);
    return {
      user_id: payload.userId,
      access_token: token,
    };
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    this.logger.log('Assigning role to user', JSON.stringify(assignRoleDto));
    const user: User = await this.usersService.updateRole(
      assignRoleDto.userId,
      assignRoleDto.roleName,
    );
    this.logger.log(
      `Role assigned successfully to user ID: ${assignRoleDto.userId}`,
    );
    return {
      user_id: user.id,
      new_role: user.roles[0].name,
    };
  }
}
