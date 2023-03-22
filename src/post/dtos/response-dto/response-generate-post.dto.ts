import { PickType } from '@nestjs/swagger';
import { PostDto } from '../post.dto';

export class ResponseGeneratePostDto extends PickType(PostDto, [
  'postTitle',
  'postUrl',
  'user',
]) {}
