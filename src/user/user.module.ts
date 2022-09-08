import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import UserInfo from './user.entity';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
