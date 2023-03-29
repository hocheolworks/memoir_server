import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import constants from 'src/common/common.constants';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import { PostCategoryDto } from '../dtos/post-category.dto';
import { PostCategory } from '../entities/post-category.entity';

@Injectable()
export class PostCategoryRepository {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCatgegoryRepository: Repository<PostCategory>,
  ) {}

  async createPostCategory(
    generatePostCategoryDto: GeneratePostCategoryDto,
    transactionManager?: EntityManager,
  ) {
    let createPostCategoryResult: PostCategoryDto;

    if (transactionManager) {
      createPostCategoryResult = transactionManager.create(PostCategory, {
        ...generatePostCategoryDto,
      });

      return await transactionManager.save(createPostCategoryResult);
    } else {
      const createPostCategoty = this.postCatgegoryRepository.create({
        ...generatePostCategoryDto,
      });

      return await this.postCatgegoryRepository.save(createPostCategoty);
    }
  }

  async findPostCategory(findPostCategoryDto: FindPostCategoryDto) {
    const postCategoryQuery = this.postCatgegoryRepository
      .createQueryBuilder('pc')
      .where('1=1');

    if (findPostCategoryDto.parentCategory) {
      postCategoryQuery.andWhere('pc.parentCategory = :parentCategory', {
        parentCategory: findPostCategoryDto.parentCategory,
      });
    }

    if (findPostCategoryDto.childCategory) {
      postCategoryQuery.andWhere('pc.childCategory = :childCategory', {
        childCategory: findPostCategoryDto.childCategory,
      });
    }

    if (findPostCategoryDto.user) {
      postCategoryQuery.andWhere('pc.userId = :userId', {
        userId: findPostCategoryDto.user.id,
      });
    }

    const postCategory = await postCategoryQuery.getOne();

    return postCategory;
  }

  async updatePostCategoryById(
    id: number,
    modifyPostCategoryDto: ModifyPostCategoryDto,
    transactionManager?: EntityManager,
  ) {
    let instance: PostCategory;
    let updateResult: UpdateResult;

    if (transactionManager) {
      instance = transactionManager.create(PostCategory, modifyPostCategoryDto);
      updateResult = await transactionManager.update(
        PostCategory,
        { id },
        instance,
      );
    } else {
      instance = this.postCatgegoryRepository.create(modifyPostCategoryDto);
      updateResult = await this.postCatgegoryRepository.update(id, instance);
    }

    if (!updateResult || updateResult.affected === 0) {
      throw new BadRequestException(constants.errorMessages.FAIL_TO_UPDATE);
    }
  }
}
