import { Injectable, Inject, ConflictException } from '@nestjs/common';
import constants from 'src/common/common.constants';
import { Repository } from 'typeorm';
import { GeneratePostDto } from './dtos/generate-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostRepository {
  constructor(
    @Inject(constants.dataBaseProviders.POST)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(generatePostDto: GeneratePostDto) {
    const createSpotGroup = this.postRepository.create({ ...generatePostDto });
    return await this.postRepository.save(createSpotGroup);
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
      .where('p.id = :id', { id })
      .getOne();

    return post;
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
