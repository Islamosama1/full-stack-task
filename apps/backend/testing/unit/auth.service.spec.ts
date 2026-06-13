import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { AuthService } from '../../src/auth/auth.service'
import { UserRepository } from '../../src/auth/repositories/user.repository'

jest.mock('bcryptjs')

describe('AuthService', () => {
  let service: AuthService
  let userRepository: jest.Mocked<UserRepository>
  let jwtService: jest.Mocked<JwtService>

  const mockUser = {
    _id: { toString: () => 'user-id-123' },
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password',
    createdAt: new Date('2024-01-01'),
  } as any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock.jwt.token'),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userRepository = module.get(UserRepository)
    jwtService = module.get(JwtService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('signup', () => {
    const dto = { name: 'Test User', email: 'Test@Example.COM', password: 'Password1!' }

    it('throws ConflictException when email is already registered', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser)

      await expect(service.signup(dto)).rejects.toThrow(ConflictException)
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com')
    })

    it('normalizes email to lowercase before lookup and creation', async () => {
      userRepository.findByEmail.mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password')
      userRepository.create.mockResolvedValue(mockUser)

      await service.signup(dto)

      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com')
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      )
    })

    it('hashes the password with bcrypt (12 salt rounds) before persisting', async () => {
      userRepository.findByEmail.mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password')
      userRepository.create.mockResolvedValue(mockUser)

      await service.signup(dto)

      expect(bcrypt.hash).toHaveBeenCalledWith('Password1!', 12)
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed_password' }),
      )
    })

    it('returns AuthResponseDto with access token and user profile', async () => {
      userRepository.findByEmail.mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password')
      userRepository.create.mockResolvedValue(mockUser)

      const result = await service.signup(dto)

      expect(result).toEqual({
        accessToken: 'mock.jwt.token',
        user: {
          id: 'user-id-123',
          name: 'Test User',
          email: 'test@example.com',
          createdAt: mockUser.createdAt,
        },
      })
    })
  })

  describe('login', () => {
    const dto = { email: 'Test@Example.COM', password: 'Password1!' }

    it('throws UnauthorizedException when the user is not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null)

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when the password does not match', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException)
    })

    it('normalizes email to lowercase before lookup', async () => {
      userRepository.findByEmail.mockResolvedValue(null)

      await expect(service.login(dto)).rejects.toThrow()
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com')
    })

    it('signs the JWT with sub and email from the user document', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      await service.login(dto)

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id-123',
        email: 'test@example.com',
      })
    })

    it('returns AuthResponseDto with access token and user profile on valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.login(dto)

      expect(result).toEqual({
        accessToken: 'mock.jwt.token',
        user: {
          id: 'user-id-123',
          name: 'Test User',
          email: 'test@example.com',
          createdAt: mockUser.createdAt,
        },
      })
    })
  })
})
