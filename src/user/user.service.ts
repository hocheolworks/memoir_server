import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { IGithubUserTypes } from './user.interface';
import { Repository } from 'typeorm';
import UserInfo from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import userConstants from './user.constants';
import { GithubSignUpDto } from './dtos/github-sign-up.dto';
import { GithubCodeDto } from './dtos/user.dto';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  /**
   * 깃허브 로그인
   */
  async githubLogin(githubCodeDto: GithubCodeDto): Promise<IGithubUserTypes> {
    const { code } = githubCodeDto;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const getTokenUrl = userConstants.requestUrl.getAccessTokenUrl;

    const request = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json',
      },
    });

    if (response.data.error) {
      throw new UnauthorizedException(401, '깃허브 인증을 실패했습니다.');
    }

    const { access_token } = response.data;
    const getUserUrl = userConstants.requestUrl.getUserInfoUrl;

    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const { login, avatar_url, name, bio, company } = data;

    const userInfo = await this.userInfoRepository.findOneBy({
      githubId: login,
    });

    // 회원 정보 없음 -> 회원 여부 필드 추가
    let isMember = true;
    if (!userInfo) {
      isMember = false;
    }

    const githubInfo: IGithubUserTypes = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company,
      githubAccessToken: access_token,
      isMember,
    };

    return githubInfo;
  }

  async githubSignUp(githubSignUpDto: GithubSignUpDto): Promise<any> {
    return githubSignUpDto;
  }
}
