import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OAuthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { LoggerService } from './logger/logger.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { DatabaseModule } from './database/database.module';

let envFilePath = '.envs/.env.development';
if (process.env.NODE_ENV === 'production') envFilePath = 'envs/.env.production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    OAuthModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
