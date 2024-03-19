import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractBearerTokenFromHeader(request);
    try {
      const { isTokenValid, jwtClaims, reasons } =
        await this.authService.verifyToken(token, 'A');
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      if (isTokenValid) {
        request['decodedData'] = jwtClaims;
        return true;
      }
      throw new ForbiddenException('invalid jwt', reasons);
    } catch (error) {
      // throw error;
      /*
      this gives client a response in the following format:
      {
          "message": "some message",
          "error": "Forbidden",
          "statusCode": 403
      }
      */
      throw new ForbiddenException(error.message || 'access jwt expired', '');
    }
  }

  private extractBearerTokenFromHeader(request: Request): string | undefined {
    const { authorization }: any = request.headers;
    if (!authorization) {
      throw new UnauthorizedException(
        'Please provide authorization prop in request headers',
      );
    }
    if (authorization.toString().trim() === '') {
      throw new UnauthorizedException(
        'Please provide authorization value in request headers',
      );
    }
    const [type, token] = authorization?.split(' ') ?? [];
    if (!token) {
      throw new UnauthorizedException('token cannot be empty');
    }
    return type === 'Bearer' ? token : undefined;
  }
}
