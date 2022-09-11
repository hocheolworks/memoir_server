import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubCodeDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import UserService from './user.service';
import { GithubSignUpDto } from './dtos/github-sign-up.dto';
import { AuthService } from 'src/auth/auth.service';

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
  @Post()
  async githubSignUp(@Body() githubSignUpDto: GithubSignUpDto) {
    const result = await this.userService.githubSignUp(githubSignUpDto);
    await this.authService.login(result);
    return result;
  }

  @ApiOperation({
    summary: '깃허브 로그인',
    description: '깃허브 로그인',
  })
  @Post('/login')
  async githubSignIn(@Body() githubCodeDto: GithubCodeDto) {
    const githubResult = await this.userService.githubSignIn(githubCodeDto);
    const loginResult = await this.authService.login(githubResult);
    return loginResult;
  }
}
