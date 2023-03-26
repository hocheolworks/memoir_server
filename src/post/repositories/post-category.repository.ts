import { Injectable, Inject } from '@nestjs/common';
import constants from 'src/common/common.constants';
import { Repository } from 'typeorm';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { PostCategory } from '../entities/post-category.entity';

@Injectable()
export class PostCategoryRepository {
  constructor(
    @Inject(constants.dataBaseProviders.POST_CATEOGRY)
    private readonly postCatgegoryRepository: Repository<PostCategory>,
  ) {}

  async createPostCategory(generatePostCategoryDto: GeneratePostCategoryDto) {
    const createPostCategoty = this.postCatgegoryRepository.create({
      ...generatePostCategoryDto,
    });
    return await this.postCatgegoryRepository.save(createPostCategoty);
  }
}
