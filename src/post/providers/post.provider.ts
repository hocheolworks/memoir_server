import constants from 'src/common/common.constants';
import { DataSource } from 'typeorm';
import { Post } from '../entities/post.entity';

export const postProviders = [
  {
    provide: constants.dataBaseProviders.POST,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
    inject: [constants.dataBaseProviders.DATA_SOURCE],
  },
];
