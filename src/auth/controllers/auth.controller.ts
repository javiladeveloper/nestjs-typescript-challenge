import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './../guards/local-auth.guard';
import { AuthService } from './../services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../guards/permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Register a new user',
    schema: {
      example: {
        user_id: 1,
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5IiwiZW1haWwiOiJlbWFpbEBkZW1vLmNvbSIsImlhdCI6MTY1MjA0NzQzNSwiZXhwIjoxNjUyMTMzODM1fQ.ikFigJQn1ttuPAV06Yjr4PL6lKvm_HMygcTU8N1P__0',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already registered',
    schema: {
      example: {
        statusCode: 409,
        message: 'USER_ALREADY_REGISTERED',
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.authService.userExists(createUserDto.email);
    if (user) {
      throw new HttpException('USER_ALREADY_REGISTERED', HttpStatus.CONFLICT);
    }
    return await this.authService.createUser(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiBody({
    schema: {
      example: {
        email: 'email@demo.com',
        password: 'password',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Get a new access token with the credentials',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5IiwiZW1haWwiOiJlbWFpbEBkZW1vLmNvbSIsImlhdCI6MTY1MjA0NzQzNSwiZXhwIjoxNjUyMTMzODM1fQ.ikFigJQn1ttuPAV06Yjr4PL6lKvm_HMygcTU8N1P__0',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('assign-role')
  @UseGuards(JwtAuthGuard)
  @Permissions('assign_role')
  @UseGuards(PermissionsGuard)
  @HttpCode(201)
  @ApiBody({
    schema: {
      example: {
        userId: 'string',
        role: 'string',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role assigned successfully',
    schema: {
      example: {
        user_id: '7',
        new_role: 'agent',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'USER_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'ROLE_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User does not have the required permissions',
    schema: {
      example: {
        statusCode: 401,
        message: 'User does not have the required permissions',
      },
    },
  })
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.authService.assignRole(assignRoleDto);
  }
}
