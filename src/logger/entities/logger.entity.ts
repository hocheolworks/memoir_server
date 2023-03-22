import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ErrorLog', schema: process.env.DB_SCHEMA_NAME })
export class ErrorLog extends CoreEntity {
  @ApiProperty({
    example: 'POST',
    description: '요청 메소드',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 10,
    comment: '요청 메소드',
  })
  method?: string;

  @ApiProperty({
    example: '/api/oauth/test',
    description: '요청 URL',
  })
  @Column({ nullable: true, type: 'varchar', length: 200, comment: '요청 URL' })
  originalUrl?: string;

  @ApiProperty({
    example: '500',
    description: '응답 상태 코드',
  })
  @Column({
    nullable: true,
    type: 'int',
    comment: '응답 상태 코드',
  })
  statusCode?: number;

  @ApiProperty({
    example:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    description: '유저 에이전트',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 200,
    comment: '유저 에이전트',
  })
  userAgent?: string;

  @ApiProperty({
    example: '172.10.2.31',
    description: '요청 ip',
  })
  @Column({ nullable: true, type: 'varchar', length: 50, comment: '요청 ip' })
  ip: string;

  @ApiProperty({
    example: '{"name":"bliss", "gender":"male"}',
    description: '요청 바디',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 2000,
    comment: 'request body',
  })
  requestBody: string;
}
