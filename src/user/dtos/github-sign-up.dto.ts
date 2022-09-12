import { OmitType } from '@nestjs/swagger';
import UserInfo from '../../user/user.entity';

export class GithubSignUpDto extends OmitType(UserInfo, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
