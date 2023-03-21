import { PartialType } from '@nestjs/swagger';
import { GeneratePostDto } from './generate-post.dto';

export class UpdatePostDto extends PartialType(GeneratePostDto) {}
