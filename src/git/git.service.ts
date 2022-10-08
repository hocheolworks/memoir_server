import { BadRequestException, Injectable } from '@nestjs/common';
import {
  simpleGit,
  SimpleGit,
  CleanOptions,
  SimpleGitOptions,
} from 'simple-git';
import gitConstants from './git.constants';
import axios, { Axios, AxiosResponse } from 'axios';
import { CreateRepositoryDto } from './dtos/create-repository.dto';
import userConstants from 'src/user/user.constants';

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

    let response: AxiosResponse;

    try {
      response = await axios.post(createRepositoryUrl, body, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: githubAccessToken,
        },
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        userConstants.errorMessages.FAIL_TO_CREASTE_REPO,
      );
    }

    return response.data;
  }
}
