import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findPostCategoryById(id: number) {
    const postCategory = await this.postCatgegoryRepository
      .createQueryBuilder('pc')
      .leftJoinAndSelect('pc.user', 'user')
      .where('pc.id = :id', { id })
      .getOne();

    if (!postCategory) {
      throw new BadRequestException(
        constants.errorMessages.POST_CATEGORY_NOT_FOUND,
      );
    }

    return postCategory;
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

    if (findPostCategoryDto.userId) {
      postCategoryQuery.andWhere('pc.userId = :userId', {
        userId: findPostCategoryDto.userId,
      });
    }

    const postCategory = await postCategoryQuery.getOne();

    if (!postCategory) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }

    return postCategory;
  }

  async findPostCategoryList(findPostCategoryDto: FindPostCategoryDto) {
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

    if (findPostCategoryDto.userId) {
      postCategoryQuery.andWhere('pc.user.id = :userId', {
        userId: findPostCategoryDto.userId,
      });
    }

    const [postCategoryList, length] =
      await postCategoryQuery.getManyAndCount();

    if (length === 0) {
      throw new NotFoundException(
        constants.errorMessages.POST_CATEGORY_NOT_FOUND,
      );
    }

    return postCategoryList;
  }

  async updatePostCategoryById(
    id: number,
    modifyPostCategoryDto: ModifyPostCategoryDto,
    transactionManager?: EntityManager,
  ) {
    let instance: PostCategory;
    let updateResult: UpdateResult;

    if (transactionManager) {
      instance = transactionManager.create(PostCategory, {
        ...modifyPostCategoryDto,
      });
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
