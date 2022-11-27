import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GithubCodeDto } from './dtos/github-code.dto';
import UserService from './user.service';
import { GithubSignUpDto } from './dtos/github-sign-up.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { IGithubUserTypes } from './user.interface';
import GithubSignInDto from './dtos/github-user.dto';
import UserInfo from './user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '깃허브 회원가입',
    description: '깃허브 회원가입',
  })
  @ApiResponse({
    status: 201,
    description: '회원 가입 성공',
    type: GithubSignUpDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async githubSignUp(@Body() githubSignUpDto: GithubSignUpDto) {
    const signUpResult = await this.userService.githubSignUp(githubSignUpDto);
    return signUpResult;
  }

  // @ApiOperation({
  //   summary: '깃허브 로그인',
  //   description: '깃허브 로그인',
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: '로그인 성공',
  //   type: GithubSignInDto,
  // // })
  // // @Post('/login')
  // // async githubSignIn(
  // //   @Body() githubCodeDto: GithubCodeDto,
  // // ): Promise<IGithubUserTypes> {
  // //   // const githubResult = await this.userService.githubSignIn(githubCodeDto);
  // //   // const loginResult = await this.authService.login(githubResult);
  // //   // return loginResult;
  // // }

  @ApiOperation({
    summary: '유저 정보 조회',
    description: '유저 정보 조회',
  })
  @Get()
  async getUserInfo(@AuthUser() userInfo: UserInfo) {
    const gitUserInfo = await this.userService.getUserInfo('bliss');
    return gitUserInfo;
  }
}
