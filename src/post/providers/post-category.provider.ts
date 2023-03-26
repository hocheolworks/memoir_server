import constants from 'src/common/common.constants';
import { DataSource } from 'typeorm';
import { PostCategory } from '../entities/post-category.entity';

export const postCategoryProviders = [
  {
    provide: constants.dataBaseProviders.POST_CATEOGRY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PostCategory),
    inject: [constants.dataBaseProviders.DATA_SOURCE],
  },
];
