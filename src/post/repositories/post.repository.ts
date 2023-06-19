import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import constants from 'src/common/common.constants';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { GeneratePostDto } from '../dtos/generate-post.dto';
import { ModifyPostDto } from '../dtos/modify-post.dto';
import { Post } from '../entities/post.entity';
import { FindPostListDto } from '../dtos/find-post-list.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(
    generatePostDto: GeneratePostDto,
    transactionManager?: EntityManager,
  ) {
    let createPostResult: Post;

    if (transactionManager) {
      createPostResult = transactionManager.create(Post, generatePostDto);
      return await transactionManager.save(createPostResult);
    } else {
      createPostResult = this.postRepository.create(generatePostDto);
      return await this.postRepository.save(createPostResult);
    }
  }

  async findPosts(findPostListDto: FindPostListDto) {
    const { userId, parentCategory, childCategory } = findPostListDto;

    const query = this.postRepository
      .createQueryBuilder('p')
      .leftJoin('p.postCategory', 'pc')
      .addSelect(['pc.id', 'pc.parentCategory', 'pc.childCategory'])
      .leftJoinAndSelect('p.user', 'user');

    if (userId) {
      query.andWhere('p.userId = :userId', { userId });
    }

    if (parentCategory) {
      query.andWhere('pc.parentCategory = :parentCategory', { parentCategory });
    }

    if (childCategory) {
      query.andWhere('pc.childCategory = :childCategory', { childCategory });
    }

    const [list, count] = await query.getManyAndCount();

    if (list.length === 0) {
      throw new NotFoundException(constants.errorMessages.POST_NOT_FOUND);
    }

    return { list, count };
  }

  async findPostListOrderByViews(page: number, pageSize: number) {
    const [list, count] = await this.postRepository
      .createQueryBuilder('p')
      .leftJoin('p.postCategory', 'pc')
      .addSelect(['pc.id', 'pc.parentCategory', 'pc.childCategory'])
      .leftJoinAndSelect('p.user', 'user')
      .orderBy('p.views', 'DESC')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount();

    if (list.length === 0) {
      throw new NotFoundException(constants.errorMessages.POST_NOT_FOUND);
    }

    return { list, count };
  }

  async findPostById(id: number) {
    const post = await this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoinAndSelect('p.postCategory', 'pc')
      .where('p.id = :id', { id })
      .getOne();

    return post;
  }

  async updatePostById(
    id: number,
    modifyPostDto: ModifyPostDto,
    transactionManager?: EntityManager,
  ) {
    let instance: Post;
    let updateResult: UpdateResult;

    if (transactionManager) {
      instance = transactionManager.create(Post, modifyPostDto);
      updateResult = await transactionManager.update(Post, { id }, instance);
    } else {
      instance = this.postRepository.create(modifyPostDto);
      updateResult = await this.postRepository.update(id, instance);
    }

    if (!updateResult || updateResult.affected === 0) {
      throw new BadRequestException(constants.errorMessages.FAIL_TO_UPDATE);
    }
  }

  async deletePostById(id: number) {
    return await this.postRepository.delete({ id });
  }
}
