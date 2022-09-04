import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import UserInfoEntity from './user.entity';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfoEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
