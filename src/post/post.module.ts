import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { postProviders } from './post.provider';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { PostRepository } from './post.repository';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [PostController],
  providers: [PostService, ...postProviders, PostRepository],
})
export class PostModule {}
