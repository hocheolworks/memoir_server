import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

export class UserInfoDto extends User {
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
}
