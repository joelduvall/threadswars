import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, IUserModel } from '../database/user.models';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: IUserModel) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async saveAvatar(id: string, avatar: string): Promise<IUser> {
    console.log(this.userModel.db.host);
    const createdUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { avatar: avatar },
      { new: true },
    );
    return createdUser;
  }

  async findAll(): Promise<IUser[]> {
    return this.userModel.getAllUsers();
  }

  async findOne(options: { id?: string; externalId?: string }): Promise<IUser> {
    if (options?.id) {
      return this.userModel.findById(options.id).exec();
    }
    if (options?.externalId) {
      return this.userModel.findOne({ externalId: options.externalId }).exec();
    }
    throw new Error('No id or externalId provided');
  }

  // async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
  //     return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  // }

  // async remove(id: string): Promise<IUser> {
  //     return this.userModel.findByIdAndRemove(id).exec();
  //}
}
