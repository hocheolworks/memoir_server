import { Injectable } from '@nestjs/common';
import {
  simpleGit,
  SimpleGit,
  CleanOptions,
  SimpleGitOptions,
} from 'simple-git';
import gitConstants from './git.constants';
import axios, { AxiosResponse } from 'axios';
import { CreateRepositoryDto } from './dtos/create-repository.dto';

@Injectable()
export class GitService {
  getHello(): string {
    return 'git module test';
  }

  async createRepository(createRepositoryDto: CreateRepositoryDto) {
    console.log(createRepositoryDto);
    const createRepositoryUrl = gitConstants.requestUrl.createRepository;
    const repositoryName = `memoir-${createRepositoryDto.githubId}`;
    const body = { name: repositoryName };
    const githubAccessToken = `token ${createRepositoryDto.githubAccessToken}`;
    console.log(githubAccessToken);

    const response = await axios.post(createRepositoryUrl, body, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: githubAccessToken,
      },
    });

    return response.data;
  }
}
