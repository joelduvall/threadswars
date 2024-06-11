import mongoose, { Model, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  externalId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  authProvider: string;
  avatar: string;
  isVerified: boolean;
}

// export interface IUser extends IUserBase, Document {
//     createdAt: Date;
//     updatedAt: Date;
// }

export interface IUserModel extends Model<IUser> {
  getAllUsers(): Promise<IUser[]>;
}

export const UserSchema = new Schema<IUser, IUserModel>(
  {
    //_id: { type: String },
    username: { type: String, required: false },
    externalId: { type: String, required: false },
    email: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    authProvider: { type: String, required: false },
    avatar: { type: String, required: false },
    isVerified: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

UserSchema.statics.getAllUsers = async function () {
  try {
    const threads = await this.find().sort({ username: -1 }).lean(); // lean() returns a plain JS object instead of a mongoose document
    return threads.map((user: IUser) => ({
      ...user,
      _id: user._id.toString(),
    }));
  } catch (error) {
    console.log('error when getting all Users', error);
  }
};

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
