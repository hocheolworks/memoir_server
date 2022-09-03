import { Injectable } from '@nestjs/common';

@Injectable()
export class GitService {
  getHello(): string {
    return 'git module test';
  }

  async createRepository(): Promise<string> {
    return 'create git repository';
  }
}
