import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [],
  controllers: [],
  exports: [],
})
export class DatabaseModule {}

// import { Module } from '@nestjs/common';

// import mongodbConfig from '../config/mongodb.config';
// import { databaseConnectionProviders } from './database-connection.providers';
// import { databaseModelsProviders } from './database-models.providers';

// @Module({
//   imports: [ConfigModule.forFeature(mongodbConfig)],
//   providers: [...databaseConnectionProviders, ...databaseModelsProviders],
//   exports: [...databaseConnectionProviders, ...databaseModelsProviders],
// })
// export class DatabaseModule { }
