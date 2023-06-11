import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];

  @ApiProperty({
    example: 'profile/',
    description: '폴더 명',
    required: true,
  })
  folder: string;
}
