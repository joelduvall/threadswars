import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadsModule } from './threads/threads.module';
import { DatabaseModule } from './database/database.module';
// import { ConfigModule } from './config/config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';
import { FileModule } from './file/file.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 100,
        limit: 300,
      },
      {
        name: 'short',
        ttl: 100000,
        limit: 300,
      },
      {
        name: 'medium',
        ttl: 100,
        limit: 2000,
      },
      {
        name: 'long',
        ttl: 600,
        limit: 1000,
      },
    ]),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGODB_USERNAME')}:${configService.get('MONGODB_PASSWORD')}@${configService.get('MONGODB_HOST')}`,
        dbName: configService.get('MONGODB_DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    FileModule,
    UsersModule,
    ThreadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
