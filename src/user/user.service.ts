import { Injectable } from '@nestjs/common';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async generateUser(generateUserDto: GenerateUserDto) {
    return this.userRepository.createUser(generateUserDto);
  }

  async findUserById(id: number) {
    return this.userRepository.findUserById(id);
  }
}
