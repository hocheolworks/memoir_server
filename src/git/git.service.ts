import { Injectable } from '@nestjs/common';
import {
  simpleGit,
  SimpleGit,
  CleanOptions,
  SimpleGitOptions,
} from 'simple-git';
@Injectable()
export class GitService {
  getHello(): string {
    return 'git module test';
  }

  async createRepository() {
    const options: Partial<SimpleGitOptions> = {
      baseDir: process.cwd(),
      binary: 'git',
      maxConcurrentProcesses: 6,
      trimmed: false,
    };
    const git: SimpleGit = simpleGit(options);
    console.log(git);

    return;
  }
}
