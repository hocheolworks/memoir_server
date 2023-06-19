import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import constants from '../post.constants';
import { PostCategoryRepository } from '../repositories/post-category.repository';

@Injectable()
export class PostCategoryService {
  constructor(
    private readonly postCategoryRepository: PostCategoryRepository,
  ) {}

  async generatePostCategory(generatePostCategoryDto: GeneratePostCategoryDto) {
    const checkConflictPostCategory = await this.findPostCategory({
      userId: generatePostCategoryDto.user.id,
      parentCategory: generatePostCategoryDto.parentCategory,
      childCategory: generatePostCategoryDto.childCategory,
    });

    if (checkConflictPostCategory) {
      throw new ConflictException(
        constants.errorMessages.DUPLICATED_POST_CATEGORY,
      );
    }
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

  async deletePostCategoryById(userId: number, id: number) {
    const postCategory = await this.postCategoryRepository.findPostCategoryById(
      id,
    );

    if (postCategory.user.id !== userId) {
      throw new UnauthorizedException(
        constants.errorMessages.UNAUTHORIZED_USER,
      );
    }

    try {
      await this.postCategoryRepository.deletePostCategory(id);
    } catch (e) {
      if (e.code === '23503') {
        throw new BadRequestException(
          constants.errorMessages.REFERENCED_CATEGORY,
        );
      } else {
        throw new BadRequestException(
          constants.errorMessages.FAIL_TO_DELETE_CATEGORY,
        );
      }
    }

    return;
  }
}
