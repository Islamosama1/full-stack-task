import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthCookieService } from './auth-cookie.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { CookieAuthResponseDto } from './dto/auth-response.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: CookieAuthResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'Email already registered' })
  async signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CookieAuthResponseDto> {
    const { accessToken, user } = await this.authService.signup(dto)
    this.authCookieService.set(res, accessToken)
    return { user }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiOkResponse({ type: CookieAuthResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CookieAuthResponseDto> {
    const { accessToken, user } = await this.authService.login(dto)
    this.authCookieService.set(res, accessToken)
    return { user }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Clear the auth cookie' })
  @ApiNoContentResponse({ description: 'Logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  logout(@Res({ passthrough: true }) res: Response): void {
    this.authCookieService.clear(res)
  }
}
