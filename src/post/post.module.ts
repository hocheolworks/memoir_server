import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import {
  PostController,
  SiteMapController,
} from './controllers/post.controller';
import { HttpModule } from '@nestjs/axios';
import { PostRepository } from './repositories/post.repository';
import { PostCategoryRepository } from './repositories/post-category.repository';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from './entities/post-category.entity';
import { PostCategoryController } from './controllers/post-category.controller';
import { PostCategoryService } from './services/post-category.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Post, PostCategory])],
  controllers: [PostController, PostCategoryController, SiteMapController],
  providers: [
    PostService,
    PostRepository,
    PostCategoryRepository,
    PostCategoryService,
  ],
})
export class PostModule {}
