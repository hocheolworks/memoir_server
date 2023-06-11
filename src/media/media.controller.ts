import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dtos/upload-image.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '이미지 업로드',
    type: UploadImageDto,
  })
  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImage(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() body: { folder: string },
  ) {
    return await this.mediaService.uploadImage(images, body.folder);
  }
}
