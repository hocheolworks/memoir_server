import { Injectable } from '@nestjs/common';
import {
  simpleGit,
  SimpleGit,
  CleanOptions,
  SimpleGitOptions,
} from 'simple-git';
import gitConstants from './git.constants';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class GitService {
  getHello(): string {
    return 'git module test';
  }

  async createRepository() {
    const createRepositoryUrl = gitConstants.requestUrl.createRepository;

    const { data } = await axios.get(createRepositoryUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        // Authorization: `token ${access_token}`,
      },
    });

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
