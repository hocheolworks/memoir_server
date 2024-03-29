import { ApiProperty } from '@nestjs/swagger';

export class FindGithubUserResponseDto {
  @ApiProperty({
    example: 'JeongCheolLee',
    description: '깃허브 id',
  })
  githubUserName: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/85550653?v=4',
    description: '프로필 이미지',
  })
  profileImage: string;

  @ApiProperty({
    example: '킹왕짱 고수(예정) 백엔드 개발자 블리스',
    description: '프로필 설명',
  })
  description: string;

  @ApiProperty({
    example: true,
    description: '메모아 회원 여부',
  })
  isMemoirUser: boolean;

  accessToken?: string;
}
