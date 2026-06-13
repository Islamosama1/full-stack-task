import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.use(cookieParser())

  app.enableCors({
    origin: configService.getOrThrow<string>('CORS_ORIGIN'),
    credentials: true,
  })

  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const config = new DocumentBuilder().setTitle('API').setVersion('1.0').build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config))

  const port = configService.get<number>('BACKEND_PORT', 4000)
  await app.listen(port)
  console.log(`Backend running on http://localhost:${port}`)
  console.log(`Swagger docs at  http://localhost:${port}/docs`)
}

bootstrap().catch(console.error)
