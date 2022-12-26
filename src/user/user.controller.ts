import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectResponse } from 'src/common/dtos/object-response.dto';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUserById(
    @Param('id') id: number,
  ): Promise<ObjectResponse<UserDto>> {
    return this.userService.findUserById(id);
  }

  @Post()
  async generateUser(
    @Body() generateUserDto: GenerateUserDto,
  ): Promise<ObjectResponse<UserDto>> {
    return await this.userService.generateUser(generateUserDto);
  }
}
