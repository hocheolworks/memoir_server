import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { GithubLoginDto } from './dtos/github-login.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '유저를 등록합니다.',
  })
  @ApiOkResponse({
    type: () => UserDto,
  })
  async generateUser(
    @Body() generateUserDto: GenerateUserDto,
  ): Promise<UserDto> {
    return await this.userService.generateUser(generateUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: '깃허브 계정으로 로그인',
  })
  @ApiOkResponse({
    type: () => UserDto,
  })
  async githubLogin(@Body() githubLoginDto: GithubLoginDto): Promise<any> {
    return await this.userService.githubLogin(githubLoginDto);
  }

  @ApiOperation({
    summary: '유저 id로 상세 조회',
  })
  @ApiOkResponse({
    type: () => UserDto,
  })
  @Get(':id')
  async findUserById(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findUserById(id);
  }
}
