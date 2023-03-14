import { Injectable, Inject } from '@nestjs/common';
import constants from 'src/common/common.constants';
import { Repository } from 'typeorm';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(constants.dataBaseProviders.USER)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(generateUserDto: GenerateUserDto) {
    const inserUserResult = await this.userRepository.insert(generateUserDto);
    console.log(inserUserResult);
    console.log(inserUserResult);
  }

  async findUserByGithubUserId(githubUserId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { githubUserId: githubUserId },
    });
  }
}
