import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { UserRepository } from './repositories/user.repository'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [UserRepository, AuthService],
})
export class AuthModule {}
