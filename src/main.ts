import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { ClassSerializerInterceptor } from '@nestjs/common';

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
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Memoir apis')
    .setDescription('Memoir apis description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'bearer-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);

  await app.listen(3000);
}
bootstrap();
