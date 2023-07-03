import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import constants from 'src/common/common.constants';
import { DeleteResult, EntityManager, Repository, UpdateResult } from 'typeorm';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import { PostCategoryDto } from '../dtos/post-category.dto';
import { PostCategory } from '../entities/post-category.entity';

@Injectable()
export class PostCategoryRepository {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
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
      const createPostCategory = this.postCategoryRepository.create({
        ...generatePostCategoryDto,
      });

      return await this.postCategoryRepository.save(createPostCategory);
    }
  }

  async findPostCategoryById(id: number) {
    const postCategory = await this.postCategoryRepository
      .createQueryBuilder('pc')
      .leftJoinAndSelect('pc.user', 'user')
      .leftJoinAndSelect('pc.parentCategory', 'ppc')
      .where('pc.id = :id', { id })
      .getOne();

    if (!postCategory) {
      throw new NotFoundException(
        constants.errorMessages.POST_CATEGORY_NOT_FOUND,
      );
    }

    return postCategory;
  }

  async findPostCategory(findPostCategoryDto: FindPostCategoryDto) {
    const postCategoryQuery = this.postCategoryRepository
      .createQueryBuilder('pc')
      .where('1=1');

    if (findPostCategoryDto.parentCategoryId) {
      postCategoryQuery.andWhere('pc.parentCategoryId = :parentCategoryId', {
        parentCategoryId: findPostCategoryDto.parentCategoryId,
      });
    }

    if (findPostCategoryDto.categoryName) {
      postCategoryQuery.andWhere('pc.categoryName = :categoryName', {
        categoryName: findPostCategoryDto.categoryName,
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
      throw new NotFoundException(
        constants.errorMessages.POST_CATEGORY_NOT_FOUND,
      );
    }

    return postCategory;
  }

  async findPostCategoryList(findPostCategoryDto: FindPostCategoryDto) {
    const query = this.postCategoryRepository
      .createQueryBuilder('pc')
      .leftJoinAndSelect('pc.user', 'u')
      .leftJoinAndSelect('pc.parentCategory', 'ppc');

    if (findPostCategoryDto.userId) {
      query.andWhere('u.id = :userId', {
        userId: findPostCategoryDto.userId,
      });
    }

    if (findPostCategoryDto.githubUserName) {
      query.andWhere('u.githubUserName = :githubUserName', {
        githubUserName: findPostCategoryDto.githubUserName,
      });
    }

    if (findPostCategoryDto.parentCategoryId) {
      query.andWhere('ppc.id = :parentCategoryId', {
        parentCategoryId: findPostCategoryDto.parentCategoryId,
      });
    }

    const [postCategoryList, length] = await query.getManyAndCount();

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
      instance = this.postCategoryRepository.create(modifyPostCategoryDto);
      updateResult = await this.postCategoryRepository.update(id, instance);
    }

    if (!updateResult || updateResult.affected === 0) {
      throw new BadRequestException(constants.errorMessages.FAIL_TO_UPDATE);
    }
  }

  async deletePostCategory(id: number, transactionManager?: EntityManager) {
    let deleteResult: DeleteResult;

    if (transactionManager) {
      deleteResult = await transactionManager.delete(PostCategory, { id });
    } else {
      deleteResult = await this.postCategoryRepository.delete({ id });
    }

    if (!deleteResult || deleteResult.affected === 0) {
      throw new BadRequestException(constants.errorMessages.FAIL_TO_DELETE);
    }
  }
}
