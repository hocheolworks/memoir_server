/* eslint-disable prettier/prettier */
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@Entity({ name: 'userInfo' })
class CustomerInfoEntity extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '이메일 혹은 문자번호 값',
    example: 'example@gmail.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  @Column({ nullable: false, length: 200 })
  key: string;
}

export default CustomerInfoEntity;
