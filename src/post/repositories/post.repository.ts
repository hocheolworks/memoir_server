import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import constants from 'src/common/common.constants';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { GeneratePostDto } from '../dtos/generate-post.dto';
import { ModifyPostDto } from '../dtos/modify-post.dto';
import { Post } from '../entities/post.entity';

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
      console.log(createPostResult);
      return await transactionManager.save(createPostResult);
    } else {
      createPostResult = this.postRepository.create(generatePostDto);
      return await this.postRepository.save(createPostResult);
    }
  }

  async findPostsByUserId(userId: number) {
    const posts = await this.postRepository
      .createQueryBuilder('p')
      .where('p.userId = :userId', { userId: userId })
      .getMany();

    return posts;
  }

  async findPostById(id: number) {
    const post = await this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
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

  //   async createUser(generateUserDto: Gene) {
  //     const checkDuplicte = await this.findUserByGithubUserName(
  //       generateUserDto.githubUserName,
  //     );

  //     if (checkDuplicte) {
  //       throw new ConflictException(constants.errorMessages.USER_ALREADY_EXISTS);
  //     }

  //     const inserUserResult = await this.userRepository.insert(generateUserDto);
  //     const user = await this.findUserById(inserUserResult.identifiers[0].id);

  //     return user;
  //   }

  //   async findUserByGithubUserName(githubUserName: string): Promise<User> {
  //     return this.userRepository.findOne({
  //       where: { githubUserName: githubUserName },
  //     });
  //   }

  //   async findUserById(id: number): Promise<User> {
  //     return this.userRepository.findOne({
  //       where: { id: id },
  //     });
  //   }
}
