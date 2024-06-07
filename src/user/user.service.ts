import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GenerateGithubAccessTokenDto } from './dtos/generate-github-access-token.dto';
import { AxiosResponse } from 'axios';
import constants from './user.constants';
import { FindGithubUserResponseDto } from './dtos/find-github-user-response.dto';
import { UserRepository } from './user.repository';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { ThirdPartyLoggerService } from 'src/logger/third-party-logger.service';
import { FindUserDto } from './dtos/find-user.dto';
import { ModifyUserDto } from './dtos/modify-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
    private readonly thirdPartyLoggerService: ThirdPartyLoggerService,
  ) {}

  async generateAccessToken(
    generateAccessTokenDto: GenerateGithubAccessTokenDto,
  ): Promise<FindGithubUserResponseDto> {
    const githubClientId = process.env.GITAPI_CLIENT_ID;
    const githubClientSecret = process.env.GITAPI_CLIENT_SECRET;

    let headers: Record<string, string> = {
      accept: 'application/json',
    };

    const data = {
      code: generateAccessTokenDto.code,
      client_id: githubClientId,
      client_secret: githubClientSecret,
    };

    let generateAccessTokenResult: AxiosResponse;

    try {
      generateAccessTokenResult = await firstValueFrom(
        this.httpService.post(
          `https://github.com/login/oauth/access_token`,
          data,
          { headers },
        ),
      );
    } catch (e) {
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      throw new BadRequestException(
        constants.errorMessages.GITHUB_LOGIN_FAILED,
      );
    }

    if (generateAccessTokenResult.data.scope !== constants.props.REPO) {
      throw new BadRequestException(
        constants.errorMessages.GET_REPOSITORY_AUTHORITY_FAILED,
      );
    }

    const accessToken = generateAccessTokenResult.data.access_token;
    const tokenType = generateAccessTokenResult.data.token_type;

    headers = {
      accept: 'application/json',
      Authorization: `${tokenType} ${accessToken}`,
    };

    let getUserInfoResult: AxiosResponse;

    try {
      getUserInfoResult = await firstValueFrom(
        this.httpService.get(`https://api.github.com/user`, { headers }),
      );
    } catch (e) {
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      throw new BadRequestException(
        constants.errorMessages.GET_GITHUB_USER_INFO_FAILED,
      );
    }

    const userInfo = new FindGithubUserResponseDto();

    userInfo.githubUserName = getUserInfoResult.data.login;
    userInfo.description = getUserInfoResult.data.bio;
    userInfo.profileImage = getUserInfoResult.data.avatar_url;
    userInfo.isMemoirUser = false;
    userInfo.accessToken = accessToken;

    const memoirUser = await this.userRepository.findUser(
      {
        githubUserName: userInfo.githubUserName,
      },
      false,
    );

    if (memoirUser) {
      userInfo.isMemoirUser = true;
    }

    return userInfo;
  }

  async generateUser(generateUserDto: GenerateUserDto, accessToken: string) {
    let generateMemoirRepositoryResult: AxiosResponse;

    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: accessToken,
    };

    console.log('>>>>', headers);

    const body = {
      name: `memoir-${generateUserDto.githubUserName}`,
      description: `${constants.props.REPOSITORY_DESCRIPTION}`,
      private: false,
    };

    try {
      generateMemoirRepositoryResult = await firstValueFrom(
        this.httpService.post(`https://api.github.com/user/repos`, body, {
          headers,
        }),
      );
    } catch (e) {
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      throw new BadRequestException(
        constants.errorMessages.CREATE_MEMOIR_REPOSITORY_FAILED,
      );
    }

    return await this.userRepository.createUser(generateUserDto);
  }

  async findGithubUser(githubUserName: string) {
    let githubUserInfo: AxiosResponse;

    const headers = {
      Accept: 'application/vnd.github+json',
    };

    try {
      githubUserInfo = await firstValueFrom(
        this.httpService.get(
          `https://${process.env.GITAPI_CLIENT_ID}:${process.env.GITAPI_CLIENT_SECRET}@api.github.com/users/${githubUserName}`,
          {
            headers,
          },
        ),
      );
    } catch (e) {
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      throw new BadRequestException(
        constants.errorMessages.GET_GITHUB_USER_INFO_FAILED,
      );
    }

    return githubUserInfo.data;
  }

  async findUser(findUserDto: FindUserDto) {
    const memoirUser = await this.userRepository.findUser(findUserDto);

    if (!memoirUser) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }

    return memoirUser;
  }

  async modifyUserById(id: number, modifyUserDto: ModifyUserDto) {
    return await this.userRepository.updateUserById(id, modifyUserDto);
  }
}
