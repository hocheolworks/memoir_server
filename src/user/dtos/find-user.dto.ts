import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class FindUserDto extends PickType(PartialType(User), [
  'githubUserName',
  'id',
]) {}
