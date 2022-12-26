import { HttpServer, Injectable } from '@nestjs/common';
import { GenerateUserDto } from './dtos/generate-user.dto';
import { GithubLoginDto } from './dtos/github-login.dto';
import { UserRepository } from './user.repository';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
  ) {}

  async generateUser(generateUserDto: GenerateUserDto) {
    const user = await this.userRepository.createUser(generateUserDto);

    return user;
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findUserById(id);

    return user;
  }

  async githubLogin(githubLoginDto: GithubLoginDto) {
    const { code } = githubLoginDto;
    const getTokenUrl = 'https://github.com/login/oauth/access_token';

    const requestBody = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    let githubUserResult: AxiosResponse;

    try {
      githubUserResult = await firstValueFrom(
        this.httpService.post(getTokenUrl, requestBody, {
          headers: {
            accept: 'application/json',
          },
        }),
      );
    } catch (e) {}

    console.log(githubUserResult.data);

    // const getUserUrl: string = 'https://api.github.com/user';
    // // 깃허브 유저 조회 API 주소

    // const { data } = await axios.get(getUserUrl, {
    //   headers: {
    //     Authorization: `token ${access_token}`,
    //   },
    //   // 헤더에는 `token ${access_token} 형식으로 넣어주어야 합니다.`
    // });

    // const { login, avatar_url, name, bio, company } = data;
    // // 깃허브 유저 조회 API에서 받은 데이터들을 골라서 처리해줍니다.

    // const githubInfo: IGithubUserTypes = {
    //   githubId: login,
    //   avatar: avatar_url,
    //   name,
    //   description: bio,
    //   location: company,
    // };

    // return githubInfo;
  }
}
