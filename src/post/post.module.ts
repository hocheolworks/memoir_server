import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { HttpModule } from '@nestjs/axios';
import { PostRepository } from './repositories/post.repository';
import { PostCategoryRepository } from './repositories/post-category.repository';
import { PostCategoryService } from './services/post-cateogory.service';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from './entities/post-category.entity';
import { PostCateogoryController } from './controllers/post-category.controller';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Post, PostCategory])],
  controllers: [PostController, PostCateogoryController],
  providers: [
    PostService,
    PostRepository,
    PostCategoryRepository,
    PostCategoryService,
  ],
})
export class PostModule {}
