import { Injectable, Inject, ConflictException } from '@nestjs/common';
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
    const checkDuplicte = await this.findUserByGithubUserName(
      generateUserDto.githubUserName,
    );

    if (checkDuplicte) {
      throw new ConflictException(constants.errorMessages.USER_ALREADY_EXISTS);
    }

    const inserUserResult = await this.userRepository.insert(generateUserDto);
    const user = await this.findUserById(inserUserResult.identifiers[0].id);

    return user;
  }

  async findUserByGithubUserName(githubUserName: string): Promise<User> {
    return this.userRepository.findOne({
      where: { githubUserName: githubUserName },
    });
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }
}
