import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { IGithubUserTypes } from './user.interface';
import { GithubCodeDto } from './dtos/user.dto';

@Injectable()
export default class UserService {
  /**
   * 회원가입
   */
  async getGithubInfo(githubCodeDto: GithubCodeDto): Promise<IGithubUserTypes> {
    const { code } = githubCodeDto;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const getTokenUrl = process.env.GET_TOKEN_URL;

    const request = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json',
      },
    });

    console.log(response.data);

    if (response.data.error) {
      // 에러 발생시
      throw new UnauthorizedException(401, '깃허브 인증을 실패했습니다.');
    }

    const { access_token } = response.data;
    const getUserUrl = 'https://api.github.com/user';
    // 깃허브 유저 조회 API 주소

    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
      // 헤더에는 `token ${access_token} 형식으로 넣어주어야 합니다.`
    });

    const { login, avatar_url, name, bio, company } = data;
    // 깃허브 유저 조회 API에서 받은 데이터들을 골라서 처리해줍니다.

    const githubInfo: IGithubUserTypes = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company,
    };

    return githubInfo;
  }
}
