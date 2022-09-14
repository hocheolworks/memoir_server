import { Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@Entity({ name: 'userInfo' })
class GithubSignInDto {
  @ApiProperty({
    description: '갓허브 id',
    example: 'JeongCheolLee',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  githubId: string;

  @ApiProperty({
    description: '프로필 이미지',
    example: 'https://avatars.githubusercontent.com/u/85550653?v=4',
    nullable: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  avatar: string;

  @ApiProperty({
    description: '이름',
    example: '이정철',
    nullable: true,
  })
  @IsNotEmpty()
  @Length(1, 200)
  name: string;

  @ApiProperty({
    description: 'description',
    example: '멋진 개발자 정철이',
    nullable: true,
  })
  @IsNotEmpty()
  @Length(1, 200)
  description: string;

  @ApiProperty({
    description: 'location',
    example: 'seoul',
    nullable: true,
  })
  @IsNotEmpty()
  @Length(1, 200)
  location: string;

  //   @ApiProperty({
  //     description: 'email',
  //     example: 'ajtskawjdcjfdl@naver.com',
  //     nullable: false,
  //   })
  //   @IsNotEmpty()
  //   @IsEmail()
  //   @Length(1, 200)
  //   githubAccessToken: string;

  @ApiProperty({
    description: 'isMember',
    example: 'true',
    nullable: false,
  })
  @IsNotEmpty()
  isMember: boolean;

  @ApiProperty({
    description: 'memoirAccessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaXRodWJJZCI6Ikplb25nQ2hlb2xMZWUiLCJnaXRodWJBY2Nlc3NUb2tlbiI6Imdob19wckRRb1llN1Fyb2syMGM5RDdoZUFhenNvN29RMmMyczFRMlkiLCJpYXQiOjE2NjI5NTcyMzEsImV4cCI6MTY2ODE0MTIzMX0.hrvtmJm00dQ_fqJSS1acHuiaa46az7qV_1s5KtlKLj8',
    nullable: false,
  })
  @IsNotEmpty()
  memoirAccessToken: string;
}

export default GithubSignInDto;
