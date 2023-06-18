import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dtos/upload-image.dto';
import { MemoirUserGuard } from 'src/common/guards/memoir-user.guard';
import constants from 'src/common/common.constants';

@ApiTags('Media')
@ApiBearerAuth(constants.props.BearerToken)
@UseGuards(MemoirUserGuard)
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
