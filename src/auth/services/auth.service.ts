import { Injectable } from '@nestjs/common';
import { UsersService } from './../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './../../users/models/user.entity';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { AssignRoleDto } from '../controllers/dto/assign-role.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (
      user &&
      (await this.usersService.comparePassword(pass, user.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    console.log('Generated JWT token:', token);
    console.log('Payload:', payload);
    return {
      access_token: token,
    };
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    return !!user;
  }

  async createUser(userDto: CreateUserDto) {
    const user: User = await this.usersService.create(userDto);
    const payload = { userId: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async assignRole(assignRoleDto: AssignRoleDto): Promise<User> {
    return this.usersService.updateRole(
      assignRoleDto.userId,
      assignRoleDto.roleName,
    );
  }
}
