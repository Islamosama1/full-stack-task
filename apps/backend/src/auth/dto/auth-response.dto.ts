import { ApiProperty } from '@nestjs/swagger'

export class UserProfileDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() email!: string
  @ApiProperty() createdAt!: Date
}

export class AuthResponseDto {
  @ApiProperty() accessToken!: string
  @ApiProperty({ type: UserProfileDto }) user!: UserProfileDto
}

export class CookieAuthResponseDto {
  @ApiProperty({ type: UserProfileDto }) user!: UserProfileDto
}
