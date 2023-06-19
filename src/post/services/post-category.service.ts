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
    let checkConflictPostCategory;
    try {
      checkConflictPostCategory =
        await this.postCategoryRepository.findPostCategory({
          userId: generatePostCategoryDto.user.id,
          parentCategory: generatePostCategoryDto.parentCategory,
          childCategory: generatePostCategoryDto.childCategory,
        });
    } catch (e) {}

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
    const postCategoryList =
      await this.postCategoryRepository.findPostCategoryList(
        findPostCategoryDto,
      );

    let response = {};
    for (const postCategory of postCategoryList) {
      if (postCategory.parentCategory in Object.keys(response)) {
        response[postCategory.parentCategory].push(postCategory.childCategory);
      } else {
        response[postCategory.parentCategory] = [postCategory.childCategory];
      }
    }

    return response;
  }

  async modifyPostCategoryById(
    userId: number,
    id: number,
    modifyPostCategoryDto: ModifyPostCategoryDto,
  ) {
    let conflictCheck;
    if (
      modifyPostCategoryDto.parentCategory &&
      modifyPostCategoryDto.childCategory
    ) {
      try {
        conflictCheck = await this.postCategoryRepository.findPostCategory({
          userId: userId,
          parentCategory: modifyPostCategoryDto.parentCategory,
          childCategory: modifyPostCategoryDto.childCategory,
        });
      } catch (e) {}
    } else if (
      modifyPostCategoryDto.parentCategory &&
      !modifyPostCategoryDto.childCategory
    ) {
      try {
        conflictCheck = await this.postCategoryRepository.findPostCategory({
          userId: userId,
          parentCategory: modifyPostCategoryDto.parentCategory,
        });
      } catch (e) {}
    } else if (
      !modifyPostCategoryDto.parentCategory &&
      modifyPostCategoryDto.childCategory
    ) {
      try {
        conflictCheck = await this.postCategoryRepository.findPostCategory({
          userId: userId,
          childCategory: modifyPostCategoryDto.childCategory,
        });
      } catch (e) {}
    }

    if (conflictCheck) {
      throw new ConflictException(
        constants.errorMessages.DUPLICATED_POST_CATEGORY,
      );
    }

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
