import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.provider';
import { UserRepository } from './user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
