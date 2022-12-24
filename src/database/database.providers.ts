import commonConstants from 'src/common/constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: commonConstants.repositories.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity.ts'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
