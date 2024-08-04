import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtMiddleware.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      this.logger.warn('Authorization header not found');
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      this.logger.warn('Token not found');
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: 'secretKey' });
      const user = await this.usersService.findOneById(payload.sub);
      if (!user) {
        this.logger.warn(
          `User not found for token payload: ${JSON.stringify(payload)}`,
        );
        throw new UnauthorizedException('User not found');
      }
      req.user = user;
      this.logger.log(`User authenticated: ${user.email}`);
      next();
    } catch (error) {
      this.logger.error('Invalid token', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
