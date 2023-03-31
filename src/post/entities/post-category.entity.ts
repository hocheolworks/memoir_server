import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import constants from '../post.constatnts';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'PostCategory', schema: process.env.DB_SCHEMA_NAME })
@Index(
  constants.props.CATEGORY_IDX,
  ['parentCategory', 'childCategory', 'user'],
  {
    unique: true,
    where: '"deletedAt" is null',
  },
)
export class PostCategory extends CoreEntity {
  @ApiProperty({
    description: '유저 객체',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, (user) => user.id, { nullable: true, eager: true })
  @JoinColumn()
  @IsNotEmpty()
  user: User;

  @ApiProperty({
    example: '백엔드 프레임워크',
    description: '게시글 대분류',
    required: false,
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 200,
    comment: '게시글 대분류',
  })
  @MaxLength(20)
  parentCategory: string;

  @ApiProperty({
    example: 'NestJS',
    description: '게시글 소분류',
    required: false,
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 200,
    comment: '게시글 소분류',
  })
  @MaxLength(20)
  childCategory: string;
}
