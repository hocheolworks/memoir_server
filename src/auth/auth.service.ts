import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IGithubUserTypes } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(userInfo: IGithubUserTypes) {
    console.log(process.env.SECRET_KEY);
    const payload = {
      githubId: userInfo.githubId,
      githubAccessToken: userInfo.githubAccessToken,
    };
    userInfo.memoirAccessToken = this.jwtService.sign(payload);

    return userInfo;
  }
}
