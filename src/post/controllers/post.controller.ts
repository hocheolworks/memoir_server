import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { GeneratePostDto } from '../dtos/generate-post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/decorators/success-response-schema.dto';
import { PostDto } from '../dtos/post.dto';
import constants from 'src/common/common.constants';
import { MemoirUserGuard } from 'src/common/guards/memoir-user.guard';
import { GetUserInfo } from 'src/common/decorators/user.decorator';
import { UserInfoDto } from 'src/common/dtos/userInfo.dto';
import { ModifyPostDto } from '../dtos/modify-post.dto';
import { FindPostListDto } from '../dtos/find-post-list.dto';

@ApiTags('Sitemap')
@Controller()
export class SiteMapController {
  constructor(private readonly postService: PostService) {}

  @Get('sitemap')
  async findPostUrlList() {
    const result = await this.postService.findPostUrlList();

    return result;
  }
}

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '게시글을 등록합니다.',
  })
  @SuccessResponse(HttpStatus.CREATED, [
    {
      model: PostDto,
      exampleTitle: '요청 성공 응답',
    },
  ])
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Post()
  generatePost(
    @Body() generatePostDto: GeneratePostDto,
    @GetUserInfo() userInfo: UserInfoDto,
  ) {
    generatePostDto.user = userInfo;
    return this.postService.generatePost(generatePostDto);
  }

  @ApiOperation({
    summary: '게시물 리스트를 불러옵니다.',
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: PostDto,
      exampleTitle: '요청 성공 응답',
      isArrayResponse: true,
    },
  ])
  @Get()
  findPosts(@Query() findPostListDto: FindPostListDto) {
    return this.postService.findPosts(findPostListDto);
  }

  @ApiOperation({
    summary: '인기 게시글을 불러옵니다.',
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: PostDto,
      exampleTitle: '요청 성공 응답',
      isArrayResponse: false,
    },
  ])
  @Get('hottest')
  findPostListOrderByViews(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.postService.findPostListOrderByViews(page, pageSize);
  }

  @ApiOperation({
    summary: '게시글을 불러옵니다.',
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: PostDto,
      exampleTitle: '요청 성공 응답',
      isArrayResponse: false,
    },
  ])
  @Get(':id')
  findPostById(@Param('id') id: number) {
    return this.postService.findPostById(id);
  }

  @ApiOperation({
    summary: '게시글을 수정합니다.',
  })
  @HttpCode(204)
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Put(':id')
  modifyPost(
    @Param('id') id: number,
    @Body() modifyPostDto: ModifyPostDto,
    @GetUserInfo() userInfo: UserInfoDto,
  ) {
    modifyPostDto.user = userInfo;
    return this.postService.modifyPostById(id, modifyPostDto);
  }

  @ApiOperation({
    summary: '게시글을 삭제합니다.',
  })
  @HttpCode(204)
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @GetUserInfo() userInfo: UserInfoDto) {
    const userId = userInfo.id;
    return this.postService.removePostById(id, userId);
  }
}
