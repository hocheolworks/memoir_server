import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class GithubLoginDto {
  @ApiProperty({
    description: '깃허브 로그인 시 주어지는 code',
    example: 'code1230231ds',
    required: true,
  })
  @IsString()
  @Length(1, 100)
  code: string;
}
