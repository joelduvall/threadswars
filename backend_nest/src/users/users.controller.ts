import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @SkipThrottle({ short: false })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne({ id: id });
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const containerName = 'fileupload';
    const upload = await this.fileService.uploadImage(
      file.buffer,
      this.configService.get('AZURE_STORAGE_AVATAR_CONTAINER_NAME'),
    );
    this.userService.saveAvatar(id, upload);
    return { containerName, message: 'uploaded successfully' };
  }

  // @Post('/:id/upload')
  // @UseInterceptors(FileInterceptor('image'))
  // async createFile(@UploadedFile() file: Express.Multer.File, @Param('id') id) {
  //   //const containerName = 'fileupload';
  //   //const upload = await this.fileService.uploadFile(file, containerName);
  //   //this.userService.saveUrl(id, upload, containerName);
  //   return {
  //     text: 'asd',
  //     message: 'uploaded successfully',
  //   };
  // }

  // @Put(':id')
  // async update(
  //     @Param('id') id: string,
  //     @Body() updateUserDto: UpdateUserDto,
  // ) {
  //     return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //     return this.userService.remove(id);
  // }
}
