import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostCategoryService } from '../services/post-cateogory.service';

@ApiTags('PostCategories')
@Controller('post-categories')
export class PostCateogoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}
}
