import { Module } from '@nestjs/common';
import { GitService } from './git.service';
import { GitController } from './git.controller';

@Module({
  providers: [GitService],
  controllers: [GitController],
  exports: [GitService],
})
export class GitModule {}
