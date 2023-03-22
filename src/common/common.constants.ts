const constants = {
  errorMessages: {
    NEED_TOKEN: '인증 정보가 없습니다.',
    INVALID_TOKEN: '인증 정보가 올바르지 않습니다. 다시 로그인해주세요.',
    GET_GITHUB_USER_INFO_FAILED: '깃허브 유저 정보를 불러오는데 실패했습니다.',
    USER_NOT_FOUND: '존재하지 않는 회원입니다.',
    USER_ALREADY_EXISTS: '이미 존재하는 깃허브 사용자명입니다.',
    FAIL_TO_UPDATE: '업데이트에 실패했습니다.',
  },
  translates: {},
  props: {
    TokenType: 'Bearer',
    BearerToken: 'bearer-token',
  },
  dataBaseProviders: {
    DATA_SOURCE: 'DATA_SOURCE',
    ERROR_LOG: 'ErrorLog',
    USER: 'User',
    POST: 'Post',
  },
};

export default constants;
