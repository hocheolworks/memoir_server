import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRepositoryDto {
  @ApiProperty({
    description: 'github accessToken',
    example: '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',
  })
  @IsString()
  @IsNotEmpty()
  githubAccessToken: string;

  @ApiProperty({
    description: 'github id',
    example: 'BLISS96',
  })
  @IsString()
  @IsNotEmpty()
  githubId: string;
}
