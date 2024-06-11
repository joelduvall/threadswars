import { Module } from '@nestjs/common';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { threadSchema } from '../database/thread.models';
import { UserSchema } from 'src/database/user.models';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Thread', schema: threadSchema },
      { name: 'User', schema: UserSchema },
    ]),
    FileModule,
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService],
})
export class ThreadsModule {}
