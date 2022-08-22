import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '이 글을 본다면 ci/cd에 성공한것 우하하';
  }
}
