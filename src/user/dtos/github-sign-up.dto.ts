import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import UserInfo from '../../user/user.entity';

export class GithubSignUpDto extends OmitType(UserInfo, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {
  @ApiProperty({
    description: 'github accessToken',
    example: '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',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
