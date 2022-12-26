import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import commonConstants from 'src/common/constants';
import { Repository, DataSource } from 'typeorm';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { UserDto } from './dtos/user.dto';
import constants from './user.constants';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(commonConstants.repositories.USER_REPOSITORY)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createUser(generateUserDto: GenerateUserDto) {
    const user = await this.userRepository.save(generateUserDto);

    if (!user) {
      throw new BadRequestException(
        constants.errorMessages.FAIL_TO_CREATE_USER,
      );
    }

    return user;
  }

  async findUserById(id: number): Promise<UserDto> {
    const user = this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }

    return user;
  }
}
