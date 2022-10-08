import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { IGithubUserTypes } from './user.interface';
import { DataSource, Repository } from 'typeorm';
import UserInfo from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import userConstants from './user.constants';
import { GithubSignUpDto } from './dtos/github-sign-up.dto';
import { GithubCodeDto } from './dtos/github-code.dto';
import { GitService } from 'src/git/git.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
    private readonly gitServie: GitService,
    private dataSource: DataSource,
  ) {}

  /**
   * 깃허브 로그인
   */
  async githubSignIn(githubCodeDto: GithubCodeDto): Promise<IGithubUserTypes> {
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

  async githubSignUp(githubSignUpDto: GithubSignUpDto) {
    const { githubId, email, githubAccessToken } = githubSignUpDto;

    // 가입한 회원여부 및 이메일 중복 체크
    const userInfo = await this.userInfoRepository.findOne({
      where: [{ githubId }, { email }],
    });

    if (userInfo) {
      if (userInfo.githubId === 'githubId') {
        throw new BadRequestException(
          userConstants.errorMessages.userAlreadyExist,
        );
      } else {
        throw new BadRequestException(
          userConstants.errorMessages.emailAlreadyExist,
        );
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const instance = this.userInfoRepository.create(githubSignUpDto);

      await queryRunner.manager.save(instance);
      await this.gitServie.createRepository({
        githubId,
        githubAccessToken,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException(
        userConstants.errorMessages.FAIL_TO_SIGN_UP,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getUserInfo(githubId: string): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOneBy({ githubId });
    return userInfo;
  }
}
