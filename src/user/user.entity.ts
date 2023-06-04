import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, Index } from 'typeorm';
import constants from './user.constatns';

@Entity({ name: 'User', schema: process.env.DB_SCHEMA_NAME })
@Index(constants.props.UNIQUE_USER_EMAIL, ['email'], {
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

  accessToken?: string;
}
