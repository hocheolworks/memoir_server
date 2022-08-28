import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('hello');
    console.log(process.env);
    return 'env upload ci/cd test2';
  }
}
