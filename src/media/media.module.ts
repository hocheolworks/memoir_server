import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { multerOptionsFactory } from './multer-option-factory';

@Module({
  imports: [MulterModule.register()],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
