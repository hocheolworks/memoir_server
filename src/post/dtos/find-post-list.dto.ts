import { ApiProperty } from '@nestjs/swagger';

export class FindPostListDto {
  @ApiProperty({
    example: 'JeongCheolLee',
    description: '깃허브 유저 ID',
    required: true,
  })
  githubUserName: string;
}
