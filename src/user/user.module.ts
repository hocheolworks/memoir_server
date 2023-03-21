import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [HttpModule, DatabaseModule],
  providers: [...userProviders, UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
