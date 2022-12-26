const constants = {
  props: {},

  errorMessages: {
    FAIL_TO_CREATE_USER: '회원가입에 실패했습니다.',
    DUPLICATED_USER: '이미 가입된 회원입니다.',
    USER_NOT_FOUND: '존재하지 않는 회원입니다.',
  },
};

export default constants;

export enum CustomerKeys {
  APPLICATION_ID = 'APPLICATION_ID',
  PHONE = 'PHONE',
  ACCOUNT_ID = 'ACCOUNT_ID',
  NAME = 'NAME',
  ID = 'ID',
}
