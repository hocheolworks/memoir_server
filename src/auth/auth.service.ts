import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IGithubUserTypes } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(userInfo: IGithubUserTypes) {
    const payload = {
      githubId: userInfo.githubId,
      githubAccessToken: userInfo.githubAccessToken,
    };
    const result = (userInfo.memoirAccessToken = this.jwtService.sign(payload));

    return result;
  }
}
