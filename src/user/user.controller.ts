import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubCodeDto } from './dtos/user.dto';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import UserService from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '깃허브 로그인 및 회원가입',
    description: '깃허브 로그인',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/login')
  async githubLogin(@Body() githubCodeDto: GithubCodeDto) {
    const user = await this.authService.login(githubCodeDto);

    return user;
  }
}
