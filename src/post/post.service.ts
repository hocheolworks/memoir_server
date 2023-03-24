import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosResponse, AxiosError, isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ThirdPartyLoggerService } from 'src/logger/third-party-logger.service';
import { GeneratePostDto } from './dtos/generate-post.dto';
import { ModifyPostDto } from './dtos/modify-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import constants from './post.constatnts';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly httpService: HttpService,
    private readonly thirdPartyLoggerService: ThirdPartyLoggerService,
  ) {}
  async generatePost(generatePostDto: GeneratePostDto) {
    const userInfo = generatePostDto.user;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: userInfo.accesstoken,
    };

    const beforeEncodingPostBody = generatePostDto.postBody;
    const base64String = Buffer.from(beforeEncodingPostBody).toString('base64');
    const content = base64String;

    const body = {
      message: `${new Date()}에 생성된 memoir`,
      content,
    };

    let generatePostResult: AxiosResponse;
    try {
      generatePostResult = await firstValueFrom(
        this.httpService.put(
          `https://api.github.com/repos/${userInfo.githubUserName}/memoir-${userInfo.githubUserName}/contents/${generatePostDto.postTitle}.md`,
          body,
          {
            headers,
          },
        ),
      );
    } catch (e) {
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      if (e.reponse.status === 422) {
        throw new ConflictException(
          constants.errorMessages.DUPLICATED_FILE_NAME,
        );
      }

      throw new BadRequestException(
        constants.errorMessages.FAIL_TO_UPLOAD_TO_GITHUB,
      );
    }

    const postUrl = generatePostResult.data.content.html_url;
    const sha = generatePostResult.data.content.sha;

    generatePostDto.postUrl = postUrl;
    generatePostDto.sha = sha;

    return await this.postRepository.createPost(generatePostDto);
  }

  async findPostsByUserId(userId: number) {
    return await this.postRepository.findPostsByUserId(userId);
  }

  async findPostById(id: number) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      throw new NotFoundException(constants.errorMessages.POST_NOT_FOUND);
    }

    const headers = {
      Accept: 'application/vnd.github+json',
    };

    let getPostRequest: AxiosResponse;
    try {
      getPostRequest = await firstValueFrom(
        this.httpService.get(
          `https://api.github.com/repos/${post.user.githubUserName}/memoir-${post.user.githubUserName}/contents/${post.postTitle}.md`,
          {
            headers,
          },
        ),
      );
    } catch (e) {
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      throw new BadRequestException(
        constants.errorMessages.FAIL_TO_READ_POST_FROM_GITHUB,
      );
    }

    const content = getPostRequest.data.content;
    const encodedContent = Buffer.from(content, 'base64').toString();
    post['postBody'] = encodedContent;

    delete post.user;

    return post;
  }

  async modifyPostById(id: number, modifyPostDto: ModifyPostDto) {
    const modifyTarget = await this.findPostById(id);

    if (!modifyTarget) {
      throw new BadRequestException(constants.errorMessages.POST_NOT_FOUND);
    }

    let sha: string;
    sha = modifyTarget.sha;

    const userInfo = modifyPostDto.user;

    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: userInfo.accesstoken,
    };

    const beforeEncodingPostBody = modifyPostDto.postBody;
    const base64String = Buffer.from(beforeEncodingPostBody).toString('base64');
    const content = base64String;

    const body = {
      message: `${new Date()}에 수정된 memoir`,
      content,
      sha,
    };

    let modifyPostResult: AxiosResponse;
    try {
      modifyPostResult = await firstValueFrom(
        this.httpService.put(
          `https://api.github.com/repos/${userInfo.githubUserName}/memoir-${userInfo.githubUserName}/contents/${modifyPostDto.postTitle}.md`,
          body,
          {
            headers,
          },
        ),
      );
    } catch (e) {
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      throw new BadRequestException(
        constants.errorMessages.FAIL_TO_UPDATE_TO_GITHUB,
      );
    }

    const postUrl = modifyPostResult.data.content.html_url;
    sha = modifyPostResult.data.content.sha;

    modifyPostDto.postUrl = postUrl;
    modifyPostDto.sha = sha;

    return await this.postRepository.updatePostById(id, { ...modifyPostDto });
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
