import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { PostDto } from './post.dto';

export class GeneratePostDto extends PickType(PostDto, [
  'postTitle',
  'postCategory',
]) {
  @ApiProperty({
    example:
      '현재 진행하고 있는 사이드 프로젝트에서 next와 redux를 함께 사용하는 과정 중, next-redux-wrapper에 대해 큰 오해를 하고있었고, 나와 같은 실수를 하는 사람이 없길 바라며 몇자 적어본다.',
    description: '게시글 본문',
    required: true,
  })
  postBody: string;

  @ApiProperty({
    example: 'backend',
    description: '게시글의 대분류',
    required: false,
  })
  parentCateogry?: string;

  @ApiProperty({
    example: 'nestjs',
    description: '글의 소분류',
    required: false,
  })
  childCategory?: string;

  sha?: string;
  accessToken?: string;
  user?: User;
  postUrl?: string;
}
