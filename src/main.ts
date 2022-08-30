import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const SWAGGER_ID = process.env.SWAGGER_ID;
  const SWAGGER_PW = process.env.SWAGGER_PW;
  const SWAGGER_PATH = process.env.SWAGGER_PATH;

  app.use(
    [SWAGGER_PATH],
    basicAuth({
      challenge: true,
      users: {
        [SWAGGER_ID]: SWAGGER_PW,
      },
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Memoir apis')
    .setDescription('Memoir apis description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);

  await app.listen(3000);
}
bootstrap();
