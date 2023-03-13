import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { HttpService } from '@nestjs/axios';
import { GenerateGithubAccessTokenDto } from './dtos/generate-github-access-token.dto';
import constants from './user.constatns';
import { FindGithubUserResponseDto } from './dtos/find-github-user-response.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  @Post('')
  async genearetAccount(@Body() generateUserDto: any) {
    return true;
    // const account = await this.userService.generateAccount(generateAccountDto);
  }

  @Get('')
  async test(@Res() res) {
    res.sendFile('index.html', {
      root: 'public',
    });
  }

  @Get('/login/done')
  async test2(@Res() res) {
    res.sendFile('test.html', {
      root: 'public',
    });
  }

  @ApiOperation({
    summary: '깃허브 로그인',
  })
  @ApiResponse({
    status: 201,
    type: FindGithubUserResponseDto,
  })
  @Post('login')
  async generateAccessToken(
    @Body() generateGithubAccessToken: GenerateGithubAccessTokenDto,
  ) {
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    let headers: Record<string, string> = {
      accept: 'application/json',
    };

    const data = {
      code: generateGithubAccessToken.code,
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
      throw new BadRequestException(
        constants.errorMessages.GET_GITHUB_USER_INFO_FAILED,
      );
    }

    const userInfo = new FindGithubUserResponseDto();
    userInfo.githubUserName = getUserInfoResult.data.login;
    userInfo.description = getUserInfoResult.data.bio;
    userInfo.profileImage = getUserInfoResult.data.avatar_url;

    return userInfo;
  }
}
