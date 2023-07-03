import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import constants from '../post.constants';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'PostCategory', schema: process.env.DB_SCHEMA_NAME })
@Index(
  constants.props.CATEGORY_IDX,
  ['parentCategory', 'categoryName', 'user'],
  {
    unique: true,
    where: '"deletedAt" is null',
  },
)
export class PostCategory extends CoreEntity {
  @ManyToOne(() => User, (user) => user.id, { nullable: true, eager: true })
  @JoinColumn()
  @IsNotEmpty()
  user: User;

  @ManyToOne(
    () => PostCategory,
    (postCategory) => postCategory.parentCategory,
    { nullable: true },
  )
  @Index()
  @JoinColumn()
  @MaxLength(20)
  parentCategory: PostCategory;

  @ApiProperty({
    example: 'NestJS',
    description: '게시글 카테고리 이름',
    required: false,
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 200,
    comment: '게시글 카테고리 이름',
  })
  @Index()
  @IsOptional()
  @MaxLength(20)
  categoryName: string;
}
