const constants = {
  errorMessages: {
    UNAUTHORIZED_USER: '본인의 글만 삭제할 수 있습니다.',
    FAIL_TO_UPLOAD_TO_GITHUB: '게시글을 깃허브에 등록하는데 실패했습니다.',
    FAIL_TO_UPDATE_TO_GITHUB: '깃허브에서 게시글을 수정하는데 실패했습니다.',
    DUPLICATED_FILE_NAME:
      '게시글을 깃허브에 등록하는데 실패했습니다. 같은 제목의 글이 있지 않은지 확인해주세요.',
    FAIL_TO_READ_MD_FILE: '게시글 파일 생성에 실패했습니다.',
    FAIL_TO_DELETE_FILE_ON_GITHUB: '게시글 생성에 실패했습니다.',
    POST_NOT_FOUND: '존재하지 않는 게시글입니다.',
    FAIL_TO_READ_POST_FROM_GITHUB:
      '깃허브에서 게시글을 불러오는데 실패했습니다.',
  },
  props: {
    USER_IDX: 'user_index',
    CATEGORY_IDX: 'category_IDX',
  },
};

export default constants;
