import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitModule } from './git/git.module';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import UserInfo from './user/user.entity';

/**
 * ENV 설정
 */
let envFilePath = './envs/.envs';
if (process.env.NODE_ENV === 'production') {
  envFilePath = './envs/.envs';
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
      schema: process.env.DB_SCHEMA_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.DB_LOGGING === 'true' ? true : false,
      autoLoadEntities: true,
      ssl: process.env.DB_SSL === 'true' ? true : false,
      // entities: ['dist/src/**/*.entity{.ts,.js}'],
    }),
    // GitModule,
    // UserModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
