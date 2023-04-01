import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ThirdPartyLoggerService } from 'src/logger/third-party-logger.service';
import { DataSource } from 'typeorm';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { GeneratePostDto } from '../dtos/generate-post.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import { ModifyPostDto } from '../dtos/modify-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { Post } from '../entities/post.entity';
import constants from '../post.constatnts';
import { PostCategoryRepository } from '../repositories/post-category.repository';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postCategoryRepository: PostCategoryRepository,
    private readonly httpService: HttpService,
    private readonly thirdPartyLoggerService: ThirdPartyLoggerService,
    private readonly dataSource: DataSource,
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

      if (e.response.status === 422) {
        throw new ConflictException(
          constants.errorMessages.DUPLICATED_FILE_NAME,
        );
      }

      throw new BadRequestException(
        constants.errorMessages.FAIL_TO_UPLOAD_TO_GITHUB,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let sha: string;
    try {
      const postUrl = generatePostResult.data.content.html_url;
      sha = generatePostResult.data.content.sha;

      generatePostDto.postUrl = postUrl;
      generatePostDto.sha = sha;

      const findPostCategoryDto = new FindPostCategoryDto();
      findPostCategoryDto.parentCategory = generatePostDto.parentCateogry;
      findPostCategoryDto.childCategory = generatePostDto.childCategory;
      findPostCategoryDto.user = generatePostDto.user;

      const postCategoryConflictCheck =
        await this.postCategoryRepository.findPostCategory(findPostCategoryDto);

      let post: Post;

      if (postCategoryConflictCheck) {
        post = await this.postRepository.createPost(
          { ...generatePostDto, postCategory: postCategoryConflictCheck },
          queryRunner.manager,
        );
      } else {
        const generatePostCategoryDto = new GeneratePostCategoryDto();
        generatePostCategoryDto.parentCategory = generatePostDto.parentCateogry;
        generatePostCategoryDto.childCategory = generatePostDto.childCategory;
        generatePostCategoryDto.user = generatePostDto.user;

        const postCategory =
          await this.postCategoryRepository.createPostCategory(
            generatePostCategoryDto,
            queryRunner.manager,
          );

        post = await this.postRepository.createPost(
          { ...generatePostDto, postCategory },
          queryRunner.manager,
        );

        return post;
      }

      await queryRunner.commitTransaction();

      return post;
    } catch (e) {
      let deletePostResult: AxiosResponse;

      try {
        const body = {
          sha,
          message: `업로드 실패로 삭제된 게시글`,
        };

        deletePostResult = await firstValueFrom(
          this.httpService.request({
            url: `https://api.github.com/repos/${userInfo.githubUserName}/memoir-${userInfo.githubUserName}/contents/${generatePostDto.postTitle}.md`,
            method: 'delete',
            headers: headers,
            data: body,
          }),
        );
      } catch (err) {
        await this.thirdPartyLoggerService.createThirdPartyErrorLog(err);

        throw new BadRequestException(
          constants.errorMessages.FAIL_TO_DELETE_FILE_ON_GITHUB,
        );
      }

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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

    const modiftyPostDto = new ModifyPostDto();
    modiftyPostDto.views = Number(post.views + 1);

    await this.postRepository.updatePostById(id, modiftyPostDto);

    return post;
  }

  async modifyPostById(id: number, modifyPostDto: ModifyPostDto) {
    const modifyTarget = await this.findPostById(id);

    if (!modifyTarget) {
      throw new BadRequestException(constants.errorMessages.POST_NOT_FOUND);
    }

    if (modifyTarget.user.id !== modifyPostDto.user.id) {
      throw new UnauthorizedException(
        constants.errorMessages.UNAUTHORIZED_USER,
      );
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

    try {
      await firstValueFrom(
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

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateCategoryDto = new ModifyPostCategoryDto();
      updateCategoryDto.parentCategory = modifyPostDto.parentCateogry;
      updateCategoryDto.childCategory = modifyPostDto.childCategory;

      await this.postRepository.updatePostById(
        id,
        { ...modifyPostDto },
        queryRunner.manager,
      );

      if (updateCategoryDto.childCategory || updateCategoryDto.parentCategory) {
        await this.postCategoryRepository.updatePostCategoryById(
          id,
          updateCategoryDto,
          queryRunner.manager,
        );
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return;
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
