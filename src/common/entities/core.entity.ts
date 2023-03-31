import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CoreEntity {
  @ApiProperty({
    description: '데이터 ID(PK)',
    readOnly: true,
    example: 1,
    required: false,
  })
  @PrimaryGeneratedColumn({ comment: '데이터 ID(PK)' })
  id: number;

  @ApiProperty({
    description: '생성일시',
    readOnly: true,
    example: new Date(),
  })
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'createdAt',
    comment: '생성일시',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    readOnly: true,
    example: new Date(),
  })
  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updatedAt',
    comment: '수정일시',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '수정일시',
    readOnly: true,
    example: new Date(),
  })
  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deletedAt',
    comment: '수정일시',
  })
  deletedAt: Date;
}
