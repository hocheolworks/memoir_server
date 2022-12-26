import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Index } from 'typeorm';

//TODO Index 추가
@Entity({ name: 'User', schema: process.env.DB_SCHEMA_NAME })
export class User extends CoreEntity {
  @ApiProperty({
    description: '깃허브 아이디',
    example: 'BLISS96',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false, unique: true, length: 30 })
  githubId: number;

  @ApiProperty({
    description: '블로그 이름',
    example: '멋남 정철이',
    required: true,
  })
  @Column({ type: 'varchar', length: 20, nullable: false })
  blogName: string;

  @ApiProperty({
    description: 'email',
    example: 'jclee7503@gmail.com',
    required: true,
  })
  @IsEmail()
  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;
}
