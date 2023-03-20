import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { GenerateGithubAccessTokenDto } from './dtos/generate-github-access-token.dto';
import { FindGithubUserResponseDto } from './dtos/find-github-user-response.dto';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { Request, Response } from 'express';
import constants from 'src/common/common.constants';
import { MemoirUserGuard } from 'src/common/guards/memoir-user.guard';
import { GithubUserGuard } from 'src/common/guards/github-user.guard';
import { UserInfoDto } from 'src/common/dtos/userInfo.dto';
import { GetUserInfo } from 'src/common/decorators/user.decorator';
import { SuccessResponse } from 'src/common/decorators/success-response-schema.dto';
import { UserDto } from './dtos/user.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    summary: '깃허브 회원가입 및 메모아 레포지토리 생성',
  })
  @SuccessResponse(HttpStatus.CREATED, [
    {
      model: UserDto,
      exampleTitle: '요청 성공 응답',
    },
  ])
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(GithubUserGuard)
  @Post('signup')
  async generateUser(
    @Body() generateUserDto: GenerateUserDto,
    @Req() request: Request,
  ) {
    return await this.userService.generateUser(
      generateUserDto,
      request.headers.authorization,
    );
  }

  @ApiOperation({
    summary: '깃허브 로그인',
  })
  @SuccessResponse(HttpStatus.CREATED, [
    {
      model: FindGithubUserResponseDto,
      exampleTitle: '요청 성공 응답',
    },
  ])
  @Post('signin')
  async generateAccessToken(
    @Body() generateGithubAccessTokenDto: GenerateGithubAccessTokenDto,
    @Res() response: Response,
  ) {
    const generateResult = await this.userService.generateAccessToken(
      generateGithubAccessTokenDto,
    );

    response.setHeader(
      'Authorization',
      `${constants.props.TokenType} ${generateResult.accessToken}`,
    );

    delete generateResult.accessToken;

    response.json({
      statusCode: 201,
      data: generateResult,
    });
  }

  @ApiOperation({
    summary: '토큰으로 유저 정보를 검색합니다.',
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserInfoDto,
      exampleTitle: '요청 성공 응답',
    },
  ])
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Get('/me')
  async findUserInfoByToken(@GetUserInfo() userInfo: UserInfoDto) {
    const memoirGithubUserInfo =
      await this.userService.findUserByGithubUserName(userInfo.githubUserName);
    memoirGithubUserInfo['profileImage'] = userInfo.profileImage;
    memoirGithubUserInfo['description'] = userInfo.description;

    return memoirGithubUserInfo;
  }
}
