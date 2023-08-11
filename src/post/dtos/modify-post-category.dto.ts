import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { PostCategory } from '../entities/post-category.entity';

export class ModifyPostCategoryDto extends PickType(PostCategory, [
  'categoryName',
]) {
  @ApiProperty({
    example: 1,
    description: '게시글 카테고리 대분류(id)',
    required: false,
  })
  parentCategoryId: number;

  parentCategory: PostCategory;

  user: User;
  sha: string;
}
