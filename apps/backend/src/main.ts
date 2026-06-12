import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder().setTitle('API').setVersion('1.0').build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config))

  await app.listen(4000)
  console.log('Backend running on http://localhost:4000')
  console.log('Swagger docs at  http://localhost:4000/docs')
}

bootstrap().catch(console.error)
