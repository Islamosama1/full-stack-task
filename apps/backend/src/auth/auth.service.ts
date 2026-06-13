import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UserDocument } from './schemas/user.schema'
import { UserRepository } from './repositories/user.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { AuthResponseDto } from './dto/auth-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email.toLowerCase())
    if (existing) {
      throw new ConflictException('Email is already registered')
    }
    const hashed = await bcrypt.hash(dto.password, 12)
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashed,
    })
    return this.buildResponse(user)
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase())
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const passwordMatch = await bcrypt.compare(dto.password, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return this.buildResponse(user)
  }

  private buildResponse(user: UserDocument): AuthResponseDto {
    const accessToken = this.jwtService.sign({ sub: user._id.toString(), email: user.email })
    return {
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    }
  }
}
