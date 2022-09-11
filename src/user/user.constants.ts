const userConstants = {
  requestUrl: {
    createRepository: 'https://api.github.com/user/repos',
    getAccessTokenUrl: 'https://github.com/login/oauth/access_token',
    getUserInfoUrl: 'https://api.github.com/user',
  },
  errorMessages: {
    userAlreadyExist: '이미 가입된 회원입니다.',
    emailAlreadyExist: '중복된 이메일입니다.',
  },
};

export default userConstants;
