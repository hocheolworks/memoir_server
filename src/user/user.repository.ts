import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import constants from 'src/common/common.constants';
import { Repository } from 'typeorm';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { User } from './user.entity';
import { FindUserDto } from './dtos/find-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(generateUserDto: GenerateUserDto) {
    const checkDuplicate = await this.findUser({
      githubUserName: generateUserDto.githubUserName,
    });

    if (checkDuplicate) {
      throw new ConflictException(constants.errorMessages.USER_ALREADY_EXISTS);
    }

    const insertUserResult = await this.usersRepository.insert(generateUserDto);
    const user = await this.findUser({
      id: insertUserResult.identifiers[0].id,
    });

    return user;
  }

  async findUser(findUserDto: FindUserDto) {
    const { id, githubUserName } = findUserDto;

    if (!id && !githubUserName) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }

    const query = this.usersRepository.createQueryBuilder('u');

    if (id) {
      query.andWhere('u.id = :id', { id });
    }

    if (githubUserName) {
      query.andWhere('u.githubUserName = :githubUserName', { githubUserName });
    }

    const user = await query.getOne();

    if (!user) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }

    return user;
  }
}
