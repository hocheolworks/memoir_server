import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import constants from '../post.constatnts';

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

  async findPostCategory(findPostCategoryDto: FindPostCategoryDto) {
    return await this.postCategoryRepository.findPostCategory(
      findPostCategoryDto,
    );
  }

  async findPostCategoryList(findPostCategoryDto: FindPostCategoryDto) {
    return await this.postCategoryRepository.findPostCategoryList(
      findPostCategoryDto,
    );
  }

  async modifyPostCategoryById(
    userId: number,
    id: number,
    modifyPostCategoryDto: ModifyPostCategoryDto,
  ) {
    const postCategory = await this.postCategoryRepository.findPostCategoryById(
      id,
    );

    if (postCategory.user.id !== userId) {
      throw new UnauthorizedException(
        constants.errorMessages.UNAUTHORIZED_USER,
      );
    }

    return await this.postCategoryRepository.updatePostCategoryById(
      id,
      modifyPostCategoryDto,
    );
  }
}
