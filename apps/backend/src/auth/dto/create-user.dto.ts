import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'Jane Doe', minLength: 3 })
  @IsString()
  @MinLength(3)
  name!: string

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({
    example: 'Secret1!',
    description: 'Min 8 chars, at least 1 letter, 1 number, and 1 special character',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])/, {
    message: 'password must contain at least 1 letter, 1 number, and 1 special character',
  })
  password!: string
}
