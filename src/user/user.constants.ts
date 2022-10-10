const userConstants = {
  requestUrl: {
    createRepository: 'https://api.github.com/user/repos',
    getAccessTokenUrl: 'https://github.com/login/oauth/access_token',
    getUserInfoUrl: 'https://api.github.com/user',
  },
  errorMessages: {
    userAlreadyExist: '이미 가입된 회원입니다.',
    emailAlreadyExist: '중복된 이메일입니다.',
    FAIL_TO_SIGN_UP: '회원 가입에 실패했습니다.',
    FAIL_TO_CREASTE_REPO: '레포지토리 생성에 실패했습니다.',
    FAIL_TO_GITHUB_AUTHORIZE: '깃허브 인증을 실패했습니다.',
  },
};

export default userConstants;
