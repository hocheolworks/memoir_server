import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitModule } from './git/git.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import UserInfo from './user/user.entity';

/**
 * ENV 설정
 */
let envFilePath = './envs/.envs';
if (process.env.NODE_ENV === 'production') {
  envFilePath = './envs/.envs';
  console.log(process.env.NODE_ENV);
  console.log(envFilePath);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_USERNAME);
  console.log(process.env);
}
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: envFilePath, isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserInfo],
      synchronize: true,
      autoLoadEntities: true,
    }),
    GitModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
