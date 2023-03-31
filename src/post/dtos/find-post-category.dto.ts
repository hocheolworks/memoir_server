import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { PostCategory } from '../entities/post-category.entity';

export class FindPostCategoryDto extends PickType(PartialType(PostCategory), [
  'childCategory',
  'parentCategory',
  'id',
]) {
  @ApiProperty({
    required: false,
    description: '유저 테이블 id',
    example: 1,
  })
  userId?: number;

  user?: User;
}
