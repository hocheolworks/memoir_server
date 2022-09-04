import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubCodeDto } from './dtos/user.dto';
import UserService from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '깃허브 로그인 및 회원가입',
    description: '깃허브 로그인',
  })
  @Post('/login')
  async getGithubInfo(@Body() githubCodeDto: GithubCodeDto) {
    const user = await this.userService.getGithubInfo(githubCodeDto);

    return user;
  }
}
