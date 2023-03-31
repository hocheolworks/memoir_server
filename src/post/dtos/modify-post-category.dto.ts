import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { PostCategory } from '../entities/post-category.entity';

export class ModifyPostCategoryDto extends PickType(PostCategory, [
  'childCategory',
  'parentCategory',
]) {
  user: User;
}
