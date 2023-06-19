import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/user.entity';

export class FindPostCategoryDto {
  @ApiProperty({
    example: 'Bliss96',
    description: '깃허브 사용자 명',
  })
  @IsNotEmpty()
  githubUserName?: string;

  userId?: number;
  parentCategory?: string;
  childCategory?: string;
  user?: User;
}
