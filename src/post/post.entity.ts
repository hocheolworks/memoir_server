import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import constants from './post.constatnts';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'Post', schema: process.env.DB_SCHEMA_NAME })
export class Post extends CoreEntity {
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'userId' })
  @IsNotEmpty()
  user: User;

  @ApiProperty({
    example: '트랜잭션에 관하여..',
    description: '게시글 제목',
    required: true,
  })
  @Column({
    nullable: false,
    type: 'varchar',
    length: 30,
    comment: '게시글 제목',
  })
  @IsNotEmpty()
  postTitle: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 300,
    comment: '게시글 URL',
  })
  postUrl: string;

  @Column({
    nullable: false,
    type: 'int',
    comment: '조회수',
    default: 0,
  })
  views?: number;
}
