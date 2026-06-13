import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const token = request.cookies?.accessToken
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      this.jwtService.verify(token)
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }
}
