import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { postProviders } from './providers/post.provider';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { PostRepository } from './repositories/post.repository';
import { postCategoryProviders } from './providers/post-category.provider';
import { PostCategoryRepository } from './repositories/post-category.repository';
import { PostCategoryService } from './services/post-cateogory.service';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [PostController],
  providers: [
    PostService,
    ...postProviders,
    PostRepository,
    ...postCategoryProviders,
    PostCategoryRepository,
    PostCategoryService,
  ],
})
export class PostModule {}
