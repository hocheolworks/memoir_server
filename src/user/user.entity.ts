import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, Index } from 'typeorm';
import constants from './user.constants';
import { Length } from 'class-validator';

@Entity({ name: 'User', schema: process.env.DB_SCHEMA_NAME })
@Index(constants.props.UNIQUE_USER_EMAIL, ['email'], {
  unique: true,
  where: '"deletedAt" is null',
})
@Index(constants.props.UNIQUE_USER_NAME, ['githubUserName'], {
  unique: true,
  where: '"deletedAt" is null',
})
export class User extends CoreEntity {
  @ApiProperty({
    example: 'JeongCheolLee',
    description: '깃허브 유저 ID',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 50,
    comment: '깃허브 유저 ID',
  })
  githubUserName: string;

  @ApiProperty({
    example: '개발새발',
    description: '요청 URL',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 30,
    comment: '블로그 이름',
  })
  blogName: string;

  @ApiProperty({
    example: 'jclee7503@gmail.com',
    description: '이메일',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 200,
    comment: '이메일',
  })
  email: string;

  @ApiProperty({
    example: '개고수 블리스의 블로그',
    description: '블로그 소개글',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 1000,
    comment: '블로그 소개 글',
  })
  @Length(1, 1000)
  blogIntroduction: string;

  accessToken?: string;
}
