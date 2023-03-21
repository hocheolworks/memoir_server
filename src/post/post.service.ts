import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GeneratePostDto } from './dtos/generate-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import constants from './post.constatnts';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly httpService: HttpService,
  ) {}
  async generatePost(generatePostDto: GeneratePostDto) {
    const userInfo = generatePostDto.user;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: userInfo.accesstoken,
    };

    const beforeEncodingPostBody = generatePostDto.postBody;
    const content = Buffer.from(beforeEncodingPostBody, 'binary').toString(
      'base64',
    );

    const body = {
      message: 'test',
      content,
    };

    let generatePostResult: AxiosResponse;
    try {
      generatePostResult = await firstValueFrom(
        this.httpService.put(
          `https://api.github.com/repos/${userInfo.githubUserName}/memoir-${userInfo.githubUserName}/contents/${generatePostDto.postTitle}`,
          body,
          {
            headers,
          },
        ),
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        constants.errorMessages.FAIL_TO_UPLOAD_TO_GITHUB,
      );
    }

    const postUrl = generatePostResult.data.content.html_url;
    generatePostDto.postUrl = postUrl;

    return await this.postRepository.createPost(generatePostDto);
  }

  async findPostsByUserId(userId: number) {
    return await this.postRepository.findPostsByUserId(userId);
  }

  async findPostById(id: number) {
    return await this.postRepository.findPostById(id);
  }

  async deletePostById(id: number, userId: number) {
    const post = await this.findPostById(id);
    const author = post.user.id;

    if (author !== userId) {
      throw new UnauthorizedException(
        constants.errorMessages.UNAUTHORIZED_USER,
      );
    }
    return await this.postRepository.deletePostById(id);
  }

  findAll() {
    return `This action returns all post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }
}
