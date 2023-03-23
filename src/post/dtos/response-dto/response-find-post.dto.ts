import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostDto } from '../post.dto';

export class ResponseFindPostDto extends OmitType(PostDto, ['user']) {
  @ApiProperty({
    example:
      '현재 진행하고 있는 사이드 프로젝트에서 next와 redux를 함께 사용하는 과정 중, next-redux-wrapper에 대해 큰 오해를 하고있었고, 나와 같은 실수를 하는 사람이 없길 바라며 몇자 적어본다.',
    description: '포스트 내용',
  })
  postBody: string;
}