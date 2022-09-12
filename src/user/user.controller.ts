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
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GithubCodeDto } from './dtos/github-code.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import UserService from './user.service';
import { GithubSignUpDto } from './dtos/github-sign-up.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { IGithubUserTypes } from './user.interface';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

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
  async githubSignUp(
    @Body() githubSignUpDto: GithubSignUpDto,
  ): Promise<GithubSignUpDto> {
    const signUpResult = await this.userService.githubSignUp(githubSignUpDto);
    return signUpResult;
  }

  @ApiOperation({
    summary: '깃허브 로그인',
    description: '깃허브 로그인',
  })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: GithubSignUpDto,
  })
  @Post('/login')
  async githubSignIn(
    @Body() githubCodeDto: GithubCodeDto,
  ): Promise<IGithubUserTypes> {
    const githubResult = await this.userService.githubSignIn(githubCodeDto);
    const loginResult = await this.authService.login(githubResult);
    return loginResult;
  }

  @ApiOperation({
    summary: '유저 정보 조회',
    description: '유저 정보 조회',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserInfo(@AuthUser() user: any) {
    return 'hello';
  }
}
