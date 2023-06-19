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
import { UserService } from 'src/user/user.service';
import { DataSource } from 'typeorm';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { GeneratePostDto } from '../dtos/generate-post.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import { ModifyPostDto } from '../dtos/modify-post.dto';
import { Post } from '../entities/post.entity';
import constants from '../post.constants';
import { PostCategoryRepository } from '../repositories/post-category.repository';
import { PostRepository } from '../repositories/post.repository';
import { PostCategory } from '../entities/post-category.entity';
import { FindPostListDto } from '../dtos/find-post-list.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postCategoryRepository: PostCategoryRepository,
    private readonly httpService: HttpService,
    private readonly thirdPartyLoggerService: ThirdPartyLoggerService,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}
  async generatePost(generatePostDto: GeneratePostDto) {
    const userInfo = generatePostDto.user;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: userInfo.accessToken,
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
      findPostCategoryDto.parentCategory = generatePostDto.parentCategory;
      findPostCategoryDto.childCategory = generatePostDto.childCategory;
      findPostCategoryDto.user = generatePostDto.user;

      let postCategoryConflictCheck: PostCategory;

      try {
        postCategoryConflictCheck =
          await this.postCategoryRepository.findPostCategory(
            findPostCategoryDto,
          );
      } catch (e) {}

      let post: Post;

      if (postCategoryConflictCheck) {
        post = await this.postRepository.createPost(
          { ...generatePostDto, postCategory: postCategoryConflictCheck },
          queryRunner.manager,
        );
      } else {
        const generatePostCategoryDto = new GeneratePostCategoryDto();
        generatePostCategoryDto.parentCategory = generatePostDto.parentCategory;
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

  async findPostsByUserId(findPostListDto: FindPostListDto) {
    return await this.postRepository.findPosts(findPostListDto);
  }

  async findPostListOrderByViews(page: number, pageSize: number) {
    return await this.postRepository.findPostListOrderByViews(page, pageSize);
  }

  async findPosts(findPostListDto: FindPostListDto) {
    const user = await this.userService.findUser({
      githubUserName: findPostListDto.githubUserName,
    });
    findPostListDto.userId = user.id;

    return await this.postRepository.findPosts(findPostListDto);
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

    const modifyPostDto = new ModifyPostDto();
    modifyPostDto.views = Number(post.views + 1);

    await this.postRepository.updatePostById(id, modifyPostDto);

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
      Authorization: userInfo.accessToken,
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
      updateCategoryDto.parentCategory = modifyPostDto.parentCategory;
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

  async removePostById(id: number, userId: number) {
    const post = await this.findPostById(id);
    const author = post.user.id;

    if (author !== userId) {
      throw new UnauthorizedException(
        constants.errorMessages.UNAUTHORIZED_USER,
      );
    }
    return await this.postRepository.deletePostById(id);
  }
}
