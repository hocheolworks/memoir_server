import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GithubCodeDto {
  @ApiProperty({
    description: 'github Oauth code',
    example: '1234512',
  })
  @IsString()
  readonly code: string;
}
