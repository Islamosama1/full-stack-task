import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let jwtService: jest.Mocked<JwtService>

  const makeContext = (cookies: Record<string, string> = {}): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ cookies }) }),
    }) as unknown as ExecutionContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard, { provide: JwtService, useValue: { verify: jest.fn() } }],
    }).compile()

    guard = module.get<JwtAuthGuard>(JwtAuthGuard)
    jwtService = module.get(JwtService)
  })

  afterEach(() => jest.clearAllMocks())

  it('throws UnauthorizedException when no accessToken cookie is present', () => {
    expect(() => guard.canActivate(makeContext())).toThrow(UnauthorizedException)
  })

  it('throws UnauthorizedException when the token fails verification', () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid token')
    })

    expect(() => guard.canActivate(makeContext({ accessToken: 'bad.token' }))).toThrow(
      UnauthorizedException,
    )
  })

  it('returns true when the token is valid', () => {
    jwtService.verify.mockReturnValue({ sub: 'user-id', email: 'test@example.com' })

    const result = guard.canActivate(makeContext({ accessToken: 'valid.token' }))

    expect(result).toBe(true)
    expect(jwtService.verify).toHaveBeenCalledWith('valid.token')
  })
})
