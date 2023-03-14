import constants from 'src/common/common.constants';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: constants.dataBaseProviders.USER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [constants.dataBaseProviders.DATA_SOURCE],
  },
];
