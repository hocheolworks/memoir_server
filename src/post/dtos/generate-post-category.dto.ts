import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { PostCategoryDto } from './post-category.dto';

export class GeneratePostCategoryDto extends PickType(PostCategoryDto, [
  'parentCategory',
  'childCategory',
]) {
  user?: User;
}
