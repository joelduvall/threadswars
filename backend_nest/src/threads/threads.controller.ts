import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ThreadsService } from './threads.service'; // Import the ThreadService class
import { CreateThreadDto } from './dto/create-thread.dto';
import { IThread, IThreadMedia } from 'src/database/thread.models';
import { AnyFilesInterceptor } from '@nestjs/platform-express/multer/interceptors';
import * as sharp from 'sharp';
import { FileService } from 'src/file/file.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('threads')
export class ThreadsController {
  //Add constructor that takes Threadservice as a parameter
  constructor(
    private readonly configService: ConfigService,
    private readonly threadService: ThreadsService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async findAll(): Promise<IThread[]> {
    //uses the ThreadService and returns an array of Threads if successful and returns an error if not
    return await this.threadService.getThreads();
  }

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  async findAllForUser(@Param('id') id: string): Promise<IThread[]> {
    //uses the ThreadService and returns an array of Threads if successful and returns an error if not
    console.log(id);
    return await this.threadService.getThreads();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body() createThreadDto: CreateThreadDto,
  ): Promise<string> {
    /*
      if externalId is null or empty string or user based on externalId in database is not found in the database then
        create a new user in the database
        update clerk externalid with the new users id
    */
    //   || this.threadService.getUser(userId: req.user.externalId) == null) {
    //   const user = await this.threadService.createUser(req.user);
    //   req.user.externalId = user.id;
    // }

    createThreadDto.userId = req.user.externalId || createThreadDto.userId;
    await this.threadService.createThread(createThreadDto);
    return 'Thread Created';
  }

  @Post(':id/media')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadThreadMedia(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
  ) {
    const mediaList: IThreadMedia[] = [];

    //for each uploaded file, upload the file to the file service but first get the height and width of the image to store in the database
    for (const file of files) {
      const sharpImage = await sharp(file.buffer).metadata();
      const upload = await this.fileService.uploadImage(
        file.buffer,
        this.configService.get('AZURE_STORAGE_THREAD_CONTAINER_NAME'),
      );

      const media: IThreadMedia = {
        url: upload,
        type: file.mimetype,
        height: sharpImage.height,
        width: sharpImage.width,
      };
      mediaList.push(media);
    }

    await this.threadService.addThreadMedia(id, mediaList);

    return 'Media Uploaded';
  }

  @Post('/:id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Request() req, @Param('id') id: string) {
    const userId = req.user.externalId;
    await this.threadService.likeThread(id, userId);
    return 'Thread Liked';
  }

  @Get('/:id/like')
  @UseGuards(JwtAuthGuard)
  async getLikes(@Param('id') id: string) {
    return await this.threadService.getLikes(id);
  }

  @Post(':id/unlike')
  @UseGuards(JwtAuthGuard)
  async unLikeThread(@Request() req, @Param('id') id: string) {
    const userId = req.user.externalId;
    await this.threadService.unLikeThread(id, userId);
    return 'Thread un-Liked';
  }
}

// @Get()
// findAll() {
//   return this.loverService.findAll();
// }

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.loverService.findOne(+id);
// }

// @Patch(':id')
// update(@Param('id') id: string, @Body() updateLoverDto: UpdateLoverDto) {
//   return this.loverService.update(+id, updateLoverDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.loverService.remove(+id);
// }
