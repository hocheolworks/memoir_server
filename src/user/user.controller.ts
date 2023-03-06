import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //   @ApiDoc({
  //     summary: '소셜 계정을 생성합니다.',
  //     responseModel: AccountDto,
  //   })
  //   @Post('social')
  //   @HttpCode(201)
  //   async generateSocialAccount(
  //     @Body() generateSocialAccountDto: GenerateSocialAccountDto,
  //   ) {
  //     const account = await this.accountSignupService.generateSocialAccount(
  //       generateSocialAccountDto,
  //     );

  //     return new ObjectResponse(account);
  //   }
}
