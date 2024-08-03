import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      console.log('JwtAuthGuard Error:', err, info);
      throw err || new UnauthorizedException();
    }
    const request = context.switchToHttp().getRequest();
    request.user = user;
    console.log('User assigned in JwtAuthGuard:', user);
    return user;
  }
}
