import { Injectable } from '@nestjs/common';
import { ObjectResponse } from 'src/common/dtos/object-response.dto';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async generateUser(generateUserDto: GenerateUserDto) {
    const user = await this.userRepository.createUser(generateUserDto);

    return new ObjectResponse(user);
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findUserById(id);

    return new ObjectResponse(user);
  }
}
