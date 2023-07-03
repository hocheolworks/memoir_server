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

  @ApiProperty({
    example: 1,
    description: '게시글 카테고리 대분류(id)',
    required: false,
  })
  parentCategoryId?: number;

  categoryName?: string;
  user?: User;
  id?: number;
}
