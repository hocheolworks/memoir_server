import { ApiProperty } from '@nestjs/swagger';

export class GenerateGithubAccessTokenDto {
  @ApiProperty({
    example: '0d61106616230ab69ea9',
    description: '깃허브 로그인 후 받은 코드',
    required: true,
  })
  code: string;
}
