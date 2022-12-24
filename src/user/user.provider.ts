import commonConstants from 'src/common/constants';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: commonConstants.repositories.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [commonConstants.repositories.DATA_SOURCE],
  },
];
