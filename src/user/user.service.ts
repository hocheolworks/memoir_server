import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GenerateGithubAccessTokenDto } from './dtos/generate-github-access-token.dto';
import { AxiosResponse } from 'axios';
import constants from './user.constatns';
import { FindGithubUserResponseDto } from './dtos/find-github-user-response.dto';
import { UserRepository } from './user.repository';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { ThirdPartyLoggerService } from 'src/logger/third-party-logger.service';

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

    const memoirUser = await this.userRepository.findUserByGithubUserName(
      userInfo.githubUserName,
    );

    if (memoirUser) {
      userInfo.isMemoirUser = true;
    }

    return userInfo;
  }

  async generateUser(generateUserDto: GenerateUserDto, accessToken: string) {
    let generateMomoirRepositoryResult: AxiosResponse;

    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: accessToken,
    };

    const body = {
      name: `memoir-${generateUserDto.githubUserName}`,
      description: `${constants.props.REPOSITORY_DESCRIPTION}`,
      private: false,
    };

    try {
      generateMomoirRepositoryResult = await firstValueFrom(
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

  async findUserByGithubUserName(githubUserName: string) {
    const memoirUser = await this.userRepository.findUserByGithubUserName(
      githubUserName,
    );

    if (!memoirUser) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }

    return memoirUser;
  }
}
