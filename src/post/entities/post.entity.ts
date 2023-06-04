import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { PostCategory } from './post-category.entity';

@Entity({ name: 'Post', schema: process.env.DB_SCHEMA_NAME })
export class Post extends CoreEntity {
  @ApiProperty({
    description: '유저 객체',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, (user) => user.id, { nullable: false, eager: true })
  @JoinColumn()
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
    length: 200,
    comment: '게시글 제목',
  })
  @IsNotEmpty()
  @MaxLength(50)
  postTitle: string;

  @ApiProperty({
    example:
      'https://github.com/JeongCheolLee/memoir-JeongCheolLee/blob/main/%ED%98%B8%EC%A0%95%EC%9D%B4%20%EA%B8%80%20%ED%9B%94%EC%B9%98%EA%B8%B0',
    description: '게시글 URL',
    required: false,
  })
  @Column({
    nullable: false,
    type: 'varchar',
    length: 300,
    comment: '게시글 URL',
  })
  @MaxLength(300)
  postUrl: string;

  @ApiProperty({
    example: 0,
    description: '조회수',
    required: false,
  })
  @Column({
    nullable: false,
    type: 'int',
    comment: '조회수',
    default: 0,
  })
  views?: number;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '파일에 대한 sha 값(업데이트 시 필요)',
  })
  sha?: string;

  @ManyToOne(() => PostCategory, (postCategory) => postCategory.id, {
    nullable: true,
  })
  @JoinColumn()
  postCategory: PostCategory;
}
