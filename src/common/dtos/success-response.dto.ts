import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

const StringIsNumber = (value) => isNaN(Number(value)) === true;

export function EnumToArray(enumme) {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map((key) => enumme[key]);
}

export class SuccessCommonResponseDto<T> {
  @ApiProperty({ enum: EnumToArray(HttpStatus), description: '상태코드' })
  @Expose()
  statusCode: number;

  @ApiProperty({
    type: 'generic',
    description: 'object 또는 array 형식의 응답데이타가 옵니다.',
  })
  @Expose()
  data: T;
}
