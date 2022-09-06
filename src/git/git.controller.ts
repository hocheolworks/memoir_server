import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRepositoryDto } from './dtos/create-repository.dto';
import { GitService } from './git.service';

@Controller('git')
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @Get()
  getHello(): string {
    return this.gitService.getHello();
  }

  @Post('temp')
  createRepository(@Body() createRepositoryDto: CreateRepositoryDto) {
    return this.gitService.createRepository(createRepositoryDto);
  }
}
