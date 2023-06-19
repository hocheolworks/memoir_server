import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/decorators/success-response-schema.dto';
import { MemoirUserGuard } from 'src/common/guards/memoir-user.guard';
import { FindPostCategoryDto } from '../dtos/find-post-category.dto';
import { ModifyPostCategoryDto } from '../dtos/modify-post-category.dto';
import { PostCategoryDto } from '../dtos/post-category.dto';
import constants from 'src/common/common.constants';
import { GetUserInfo } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { GeneratePostCategoryDto } from '../dtos/generate-post-category.dto';
import { PostCategoryService } from '../services/post-category.service';

@ApiTags('PostCategories')
@Controller('post-categories')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @ApiOperation({
    summary: '게시글 카테고리를 생성합니다.',
  })
  @SuccessResponse(HttpStatus.CREATED, [
    {
      model: PostCategoryDto,
      exampleTitle: '요청 성공 응답',
      isArrayResponse: false,
    },
  ])
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Post()
  async generatePostCategory(
    @Body() generatePostCategoryDto: GeneratePostCategoryDto,
    @GetUserInfo() userInfo: User,
  ) {
    console.log(userInfo);

    generatePostCategoryDto.user = userInfo;
    return await this.postCategoryService.generatePostCategory(
      generatePostCategoryDto,
    );
  }

  @ApiOperation({
    summary: '게시글 카테고리를 불러옵니다.',
  })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: PostCategoryDto,
      exampleTitle: '요청 성공 응답',
      isArrayResponse: true,
    },
  ])
  @Get()
  async findPostCategoryList(
    @Query() findPostCategoryDto: FindPostCategoryDto,
  ) {
    return await this.postCategoryService.findPostCategoryList(
      findPostCategoryDto,
    );
  }

  @ApiOperation({
    summary: '게시글 카테고리를 수정합니다.',
  })
  @HttpCode(204)
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Put(':id')
  async modifyPostCategory(
    @Param('id') id: number,
    @GetUserInfo() userInfo: User,
    @Body() modifyPostCategoryDto: ModifyPostCategoryDto,
  ) {
    return await this.postCategoryService.modifyPostCategoryById(
      userInfo.id,
      id,
      modifyPostCategoryDto,
    );
  }

  @ApiOperation({
    summary: '게시글 카테고리를 삭제합니다.',
  })
  @HttpCode(204)
  @ApiBearerAuth(constants.props.BearerToken)
  @UseGuards(MemoirUserGuard)
  @Delete(':id')
  async deletePostCategory(
    @Param('id') id: number,
    @GetUserInfo() userInfo: User,
  ) {
    return await this.postCategoryService.deletePostCategoryById(
      userInfo.id,
      id,
    );
  }
}
