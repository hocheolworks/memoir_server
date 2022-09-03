import { Controller, Get, Post } from '@nestjs/common';
import { GitService } from './git.service';

@Controller('git')
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @Get()
  getHello(): string {
    return this.gitService.getHello();
  }

  @Post('temp')
  createRepository() {
    return this.gitService.createRepository();
  }
}
