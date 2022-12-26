import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [...userProviders, UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
