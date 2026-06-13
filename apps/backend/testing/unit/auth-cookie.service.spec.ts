import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { AuthCookieService } from '../../src/auth/auth-cookie.service'

describe('AuthCookieService', () => {
  let service: AuthCookieService
  let configService: { getOrThrow: jest.Mock; get: jest.Mock }
  let res: jest.Mocked<Pick<Response, 'cookie' | 'clearCookie'>>

  beforeEach(async () => {
    res = { cookie: jest.fn(), clearCookie: jest.fn() }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCookieService,
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn(), get: jest.fn() },
        },
      ],
    }).compile()

    service = module.get<AuthCookieService>(AuthCookieService)
    configService = module.get(ConfigService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('set', () => {
    it('sets an httpOnly cookie with correct maxAge derived from JWT_EXPIRES_IN', () => {
      configService.getOrThrow.mockReturnValue('24h')
      configService.get.mockReturnValue('development')

      service.set(res as any, 'my.jwt.token')

      expect(res.cookie).toHaveBeenCalledWith('accessToken', 'my.jwt.token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 86_400_000,
      })
    })

    it('sets secure: true when NODE_ENV is production', () => {
      configService.getOrThrow.mockReturnValue('1h')
      configService.get.mockReturnValue('production')

      service.set(res as any, 'token')

      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'token',
        expect.objectContaining({ secure: true }),
      )
    })

    it('sets secure: false when NODE_ENV is not production', () => {
      configService.getOrThrow.mockReturnValue('1h')
      configService.get.mockReturnValue('development')

      service.set(res as any, 'token')

      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'token',
        expect.objectContaining({ secure: false }),
      )
    })

    it('always sets sameSite: strict and path: /', () => {
      configService.getOrThrow.mockReturnValue('1h')
      configService.get.mockReturnValue('development')

      service.set(res as any, 'token')

      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'token',
        expect.objectContaining({ sameSite: 'strict', path: '/' }),
      )
    })
  })

  describe('clear', () => {
    it('clears the accessToken cookie with correct options in development', () => {
      configService.get.mockReturnValue('development')

      service.clear(res as any)

      expect(res.clearCookie).toHaveBeenCalledWith('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
      })
    })

    it('clears with secure: true in production', () => {
      configService.get.mockReturnValue('production')

      service.clear(res as any)

      expect(res.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.objectContaining({ secure: true }),
      )
    })
  })
})
