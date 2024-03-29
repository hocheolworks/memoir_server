const constants = {
  errorMessages: {
    GITHUB_LOGIN_FAILED: '깃허브 로그인에 실패했습니다.',
    GET_GITHUB_USER_INFO_FAILED:
      '깃허브로 부터 사용자 정보를 불러오는데 실패했습니다.',
    GET_REPOSITORY_AUTHORITY_FAILED:
      '메모아를 사용에 필요한 깃허브 권한을 확보하지 못했습니다.',
    USER_NOT_FOUND: '존재하지 않는 회원입니다.',
    CREATE_MEMOIR_REPOSITORY_FAILED: '메모아 레포지토리 생성에 실패했습니다.',
  },
  props: {
    REPO: 'repo',
    UNIQUE_USER_EMAIL: 'uniqueUserEmail',
    UNIQUE_USER_NAME: 'uniqueGithubUserName',
    REPOSITORY_DESCRIPTION: `Memoir's Repository, It's the place where my memoirs are stored.`,
  },
};

export default constants;
