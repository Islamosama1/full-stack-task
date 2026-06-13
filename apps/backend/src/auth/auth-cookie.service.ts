import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import ms, { StringValue } from 'ms'

const COOKIE_NAME = 'accessToken'

@Injectable()
export class AuthCookieService {
  constructor(private readonly configService: ConfigService) {}

  set(res: Response, token: string): void {
    const maxAge = ms(this.configService.getOrThrow<string>('JWT_EXPIRES_IN') as StringValue)
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge,
    })
  }

  clear(res: Response): void {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    })
  }
}
