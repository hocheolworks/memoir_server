import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'ThirdPartyErrorLog', schema: process.env.DB_SCHEMA_NAME })
export class ThirdPartyErrorLog extends CoreEntity {
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
    example: '{"name":"bliss", "gender":"male"}',
    description: '응답 바디',
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 1000,
    comment: 'response body',
  })
  responseBody: string;
}
