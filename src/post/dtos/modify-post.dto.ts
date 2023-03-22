import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/user.entity';
import { PostDto } from './post.dto';

export class ModifyPostDto extends PickType(PostDto, ['postTitle']) {
  @ApiProperty({
    example:
      '현재 진행하고 있는 사이드 프로젝트에서 next와 redux를 함께 사용하는 과정 중, next-redux-wrapper에 대해 큰 오해를 하고있었고, 나와 같은 실수를 하는 사람이 없길 바라며 몇자 적어본다.',
    description: '게시글 본문',
    required: true,
  })
  @IsNotEmpty()
  postBody: string;

  @ApiProperty({
    example: 'backend',
    description: '글의 대분류',
  })
  firstDepth?: number;

  @ApiProperty({
    example: 'nestjs',
    description: '글의 소분류',
  })
  secondDepth?: number;

  sha?: string;
  accessToken?: string;
  user?: User;
  postUrl?: string;
}
