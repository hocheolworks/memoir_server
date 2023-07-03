import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import constants from '../post.constants';
import { PostCategoryRepository } from '../repositories/post-category.repository';
import { PostCategory } from '../entities/post-category.entity';

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
          parentCategoryId: generatePostCategoryDto.parentCategoryId,
          categoryName: generatePostCategoryDto.categoryName,
        });
    } catch (e) {}

    if (checkConflictPostCategory) {
      throw new ConflictException(
        constants.errorMessages.DUPLICATED_POST_CATEGORY,
      );
    }

    let parentCategory: PostCategory;
    if (generatePostCategoryDto.parentCategoryId) {
      try {
        parentCategory = await this.postCategoryRepository.findPostCategoryById(
          generatePostCategoryDto.parentCategoryId,
        );
      } catch (e) {
        if (e.status === 404) {
          throw new NotFoundException(
            constants.errorMessages.NOT_FOUND_PARENT_POST_CATEGORY,
          );
        }

        throw new BadRequestException(
          constants.errorMessages.FAIL_TO_CREATE_POST_CATEGORY,
        );
      }

      generatePostCategoryDto.parentCategory = parentCategory;
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

    return postCategoryList;
  }

  async modifyPostCategoryById(
    userId: number,
    id: number,
    modifyPostCategoryDto: ModifyPostCategoryDto,
  ) {
    const postCategory = await this.postCategoryRepository.findPostCategoryById(
      id,
    );

    let conflictCheck;
    if (
      modifyPostCategoryDto.parentCategoryId &&
      modifyPostCategoryDto.categoryName
    ) {
      try {
        conflictCheck = await this.postCategoryRepository.findPostCategory({
          userId: userId,
          parentCategoryId: modifyPostCategoryDto.parentCategoryId,
          categoryName: modifyPostCategoryDto.categoryName,
        });
      } catch (e) {}
    } else if (
      modifyPostCategoryDto.parentCategoryId &&
      !modifyPostCategoryDto.categoryName
    ) {
      try {
        conflictCheck = await this.postCategoryRepository.findPostCategory({
          userId: userId,
          parentCategoryId: modifyPostCategoryDto.parentCategoryId,
          categoryName: postCategory.categoryName,
        });
      } catch (e) {}
    } else if (
      !modifyPostCategoryDto.parentCategoryId &&
      modifyPostCategoryDto.categoryName
    ) {
      try {
        conflictCheck = await this.postCategoryRepository.findPostCategory({
          userId: userId,
          categoryName: modifyPostCategoryDto.categoryName,
          parentCategoryId: postCategory.parentCategory.id,
        });
      } catch (e) {}
    }

    if (conflictCheck) {
      throw new ConflictException(
        constants.errorMessages.DUPLICATED_POST_CATEGORY,
      );
    }

    if (postCategory.user.id !== userId) {
      throw new UnauthorizedException(
        constants.errorMessages.UNAUTHORIZED_USER,
      );
    }

    if (modifyPostCategoryDto.parentCategoryId) {
      const parentCategory =
        await this.postCategoryRepository.findPostCategoryById(
          modifyPostCategoryDto.parentCategoryId,
        );

      if (parentCategory.parentCategory !== null) {
        throw new BadRequestException(
          constants.errorMessages.CHILD_CANNOT_BE_PARENT_CATEGORY,
        );
      }

      modifyPostCategoryDto.parentCategory = parentCategory;
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
