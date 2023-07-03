const constants = {
  errorMessages: {
    UNAUTHORIZED_USER: '본인의 글만 수정/삭제할 수 있습니다.',
    FAIL_TO_UPLOAD_TO_GITHUB: '게시글을 깃허브에 등록하는데 실패했습니다.',
    FAIL_TO_UPDATE_TO_GITHUB: '깃허브에서 게시글을 수정하는데 실패했습니다.',
    DUPLICATED_FILE_NAME:
      '게시글을 깃허브에 등록하는데 실패했습니다. 같은 제목의 글이 있지 않은지 확인해주세요.',
    FAIL_TO_READ_MD_FILE: '게시글 파일 생성에 실패했습니다.',
    FAIL_TO_DELETE_FILE_ON_GITHUB: '게시글 생성에 실패했습니다.',
    POST_NOT_FOUND: '존재하지 않는 게시글입니다.',
    FAIL_TO_READ_POST_FROM_GITHUB:
      '깃허브에서 게시글을 불러오는데 실패했습니다.',
    DUPLICATED_POST_CATEGORY: '이미 존재하는 카테고리입니다.',
    REFERENCED_CATEGORY: '게시글이 포함된 카테고리는 삭제가 불가능합니다.',
    FAIL_TO_DELETE_CATEGORY: '게시글 삭제에 실패했습니다.',
    NOT_FOUND_POST_CATEGORY: '존재하지 않는 게시글 카테고리입니다.',
    NOT_FOUND_PARENT_POST_CATEGORY:
      '존재하지 않는 게시글 카테고리 대분류 입니다.',
    FAIL_TO_CREATE_POST_CATEGORY: '게시글 카테고리 생성에 실패했습니다.',
    CHILD_CANNOT_BE_PARENT_CATEGORY:
      '게시글 소분류는 대분류로 적용될 수 없습니다.',
  },
  props: {
    USER_IDX: 'user_index',
    CATEGORY_IDX: 'category_IDX',
  },
};

export default constants;
