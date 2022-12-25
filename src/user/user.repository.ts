import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import commonConstants from 'src/common/constants';
import { Repository } from 'typeorm';
import { GenerateUserDto } from './dtos/generate-user.dto';
import constants from './user.constants';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(commonConstants.repositories.USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async createUser(generateUserDto: GenerateUserDto) {
    let user: User;
    return user;
  }

  async findUserById(id: number): Promise<User> {
    const user = this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }

    return user;
  }
}
