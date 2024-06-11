import { Injectable } from '@nestjs/common';
import { IThread, IThreadMedia, IThreadModel } from '../database/thread.models';
import { InjectModel } from '@nestjs/mongoose';
import { CreateThreadDto } from './dto/create-thread.dto';
import { IUserModel } from 'src/database/user.models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectModel('Thread') private threadModel: IThreadModel,
    @InjectModel('User') private userModel: IUserModel,
    private configService: ConfigService,
  ) {}

  async getThreads(): Promise<IThread[]> {
    return this.threadModel.getAllThreads();
  }

  async createThread(createThreadDTO: CreateThreadDto): Promise<IThread> {
    // createThreadDocument = {
    //   parentThread: createThreadDTO.parentThread,
    //   content: createThreadDTO.content,
    //   user: createThreadDTO.user,
    //   media: createThreadDTO.media,
    // }
    const user = await this.userModel.findById(createThreadDTO.userId);
    if (!user) {
      throw new Error('User not found' + test);
    }

    const createdThread = await this.threadModel.create({
      parentThread: createThreadDTO.parentThreadId,
      content: createThreadDTO.content,
      user: user,
      media: createThreadDTO.media,
      likes: [],
      replies: [],
    });

    return createdThread;
  }

  async addThreadMedia(
    threadId: string,
    threadMedia: IThreadMedia[],
  ): Promise<void> {
    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found' + test);
    }

    await thread.updateMedia(threadMedia);
  }

  async getLikes(threadId: string): Promise<string[]> {
    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found' + test);
    }

    return thread.likes;
  }

  async likeThread(threadId: string, userId: string): Promise<void> {
    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found' + test);
    }

    await thread.likeThread(userId);
  }

  async unLikeThread(threadId: string, userId: string): Promise<void> {
    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found' + test);
    }

    await thread.unlikeThread(userId);
  }
}
