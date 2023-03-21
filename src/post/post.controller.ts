import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GeneratePostDto } from './dtos/generate-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/decorators/success-response-schema.dto';
import { PostDto } from './dtos/post.dto';
import constants from 'src/common/common.constants';
import { MemoirUserGuard } from 'src/common/guards/memoir-user.guard';
import { GetUserInfo } from 'src/common/decorators/user.decorator';
import { UserInfoDto } from 'src/common/dtos/userInfo.dto';
import { userInfo } from 'os';

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
    summary: '내 게시물 리스트를 불러옵니다.',
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: PostDto,
      exampleTitle: '요청 성공 응답',
      isArrayResponse: true,
    },
  ])
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Get('me')
  findPostsByToken(@GetUserInfo() userInfo: UserInfoDto) {
    const userId = userInfo.id;
    return this.postService.findPostsByUserId(userId);
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
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Get(':id')
  findPostById(@Param('id') id: number) {
    return this.postService.findPostById(id);
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
    return this.postService.deletePostById(id, userId);
  }
}
