import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { GitService } from 'src/git/git.service';
import { UserController } from './user.controller';
import UserInfo from './user.entity';
import UserService from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), AuthModule],
  providers: [UserService, GitService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
