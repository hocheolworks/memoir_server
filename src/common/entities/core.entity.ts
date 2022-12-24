import { DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export class CoreEntity {
  @ApiProperty({
    description: '데이터 ID(PK)',
    readOnly: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '생성일시',
    readOnly: true,
  })
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'createdAt',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    readOnly: true,
  })
  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updatedAt',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '삭제일시',
    readOnly: true,
  })
  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt: Date;
}
