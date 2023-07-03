import { ApiProperty, PickType } from '@nestjs/swagger';
import { PostCategory } from '../entities/post-category.entity';
import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindPostListDto extends PickType(PostCategory, []) {
  @ApiProperty({
    example: 'JeongCheolLee',
    description: '깃허브 유저 ID',
    required: true,
  })
  githubUserName: string;

  @ApiProperty({
    example: 3,
    description: '게시글 카테고리 ID',
    required: false,
    type: Number,
  })
  @Transform(({ value }) => (value ? Number(value) : null))
  postCategoryId: number;

  userId: number;
}
