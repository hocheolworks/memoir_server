import { ApiProperty, PickType } from '@nestjs/swagger';
import { PostCategory } from '../entities/post-category.entity';

export class FindPostListDto extends PickType(PostCategory, [
  'parentCategory',
  'childCategory',
]) {
  @ApiProperty({
    example: 'JeongCheolLee',
    description: '깃허브 유저 ID',
    required: true,
  })
  githubUserName: string;

  userId: number;
}
