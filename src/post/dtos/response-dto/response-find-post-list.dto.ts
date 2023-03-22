import { OmitType } from '@nestjs/swagger';
import { PostDto } from '../post.dto';

export class ResponseFindPostListDto extends OmitType(PostDto, ['user']) {}
