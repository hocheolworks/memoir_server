import { PickType } from '@nestjs/swagger';
import UserInfo from '../../user/user.entity';

export class GithubSignUpDto extends PickType(UserInfo, [
  'githubId',
  'blogName',
  'email',
]) {}
