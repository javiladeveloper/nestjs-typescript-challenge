import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      this.logger.error('JwtAuthGuard Error:', err, info);
      throw err || new UnauthorizedException();
    }
    const request = context.switchToHttp().getRequest();
    request.user = user;
    this.logger.log(`User assigned in JwtAuthGuard: ${user.email}`);
    return user;
  }
}
