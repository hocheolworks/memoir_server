import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';

import { PostCategoryRepository } from '../repositories/post-category.repository';

@Injectable()
export class PostCategoryService {
  constructor(
    private readonly postCategoryRepository: PostCategoryRepository,
  ) {}

  async generatePostCategory(generatePostCategoryDto: GeneratePostCategoryDto) {
    return await this.postCategoryRepository.createPostCategory(
      generatePostCategoryDto,
    );
  }

  async modifyPostCategoryById(
    id: number,
    modifyPostCategoryDto: ModifyPostCategoryDto,
  ) {
    return await this.postCategoryRepository.updatePostCategoryById(
      id,
      modifyPostCategoryDto,
    );
  }
}
