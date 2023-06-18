import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MulterModule.register(), HttpModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
