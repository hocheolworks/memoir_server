/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Entity({ name: 'userInfo' })
class UserInfo extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '갓허브 id',
    example: 'Bliss96',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  @Column({ nullable: false, length: 200, unique: true })
  githubId: string;

  @ApiProperty({
    description: '블로그 이름',
    example: '개발새발ㅋㅋ',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Column({ nullable: false, length: 200 })
  blogName: string;

  @ApiProperty({
    description: 'email',
    example: 'ajtskawjdcjfdl@naver.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 200)
  @Column({ nullable: false, length: 200, unique: true })
  email: string;
}

export default UserInfo;
