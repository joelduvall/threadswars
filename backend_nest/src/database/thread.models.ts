import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from 'src/database/user.models';

export interface IThreadMedia {
  url: string;
  type: string;
  height: number;
  width: number;
}

export interface IThread {
  _id: string;
  parentThread: IThread;
  content: string;
  user: IUser;
  media: IThreadMedia[];
  likes: string[];
  replies: string[];
  createdAt: Date;
}

interface IThreadMethods {
  likeThread(threadId: string): Promise<void>;
  unlikeThread(threadId: string): Promise<void>;
  removeThread(threadId: string): Promise<void>;
  replyToThread(parentThreadId: string, reply: IThread): Promise<void>;
  updateMedia(media: IThreadMedia[]): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface IThreadModel extends Model<IThread, {}, IThreadMethods> {
  getAllThreads(): Promise<IThread[]>;
}

//export interface IThreadDocument extends IThreadBase, IThreadMethods {}

const IThreadMediaSchema = new mongoose.Schema({
  url: String,
  type: String,
  height: Number,
  width: Number,
});

export const threadSchema = new Schema<IThread, IThreadModel, IThreadMethods>({
  // _id: { type: String, required: false },
  parentThread: { type: Schema.Types.ObjectId, ref: 'Thread', required: false },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  media: { type: [IThreadMediaSchema], default: [] },
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

threadSchema.methods.likeThread = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    console.log('error when liking thread', error);
  }
};

threadSchema.methods.unlikeThread = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    console.log('error when unliking Thread', error);
  }
};

threadSchema.methods.removeThread = async function () {
  try {
    await this.model('Thread').deleteOne({ _id: this._id });
  } catch (error) {
    console.log('error when removing thread', error);
  }
};

threadSchema.methods.replyToThread = async function (parentThreadId: string) {
  try {
    await this.updateOne({ $addToSet: { replies: parentThreadId } });
  } catch (error) {
    console.log('error when removing thread', error);
  }
};

// db.inventory.updateOne(
//   { _id: 2 },
//   { $addToSet: { tags: { $each: [ "camera", "electronics", "accessories" ] } } }
// )

threadSchema.methods.updateMedia = async function (media: IThreadMedia[]) {
  try {
    //filter media to remove duplicates from this.media where url is the same
    const mediaToAdd = media.filter((newMedia) => {
      return !this.media.some((currentMedia) => {
        return currentMedia.url == newMedia.url;
      });
    });

    await this.updateOne({
      $addToSet: { media: { $each: mediaToAdd } },
    });
  } catch (error) {
    console.log('error when removing thread', error);
  }
};

// ThreadSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
//     try {
//         const comment = await Comment.create(commentToAdd);
//         this.comments.push(comment._id);
//         await this.save();
//     } catch (error) {
//         console.log("error when commenting on post", error);
//     }
// };export interface IThreadDocument extends IThreadBase, IThreadMethods {}

threadSchema.statics.getAllThreads = async function () {
  try {
    const threads = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'parentThread',
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: 'user',
        options: { sort: { createdAt: -1 } },
      })
      .lean(); // lean() returns a plain JS object instead of a mongoose document
    return threads.map(
      (thread: IThread & { _id: mongoose.Types.ObjectId }) => ({
        ...thread,
        _id: thread._id.toString(),
        threadId: thread._id.toString(),
        // parentThread: thread.parentThread && {
        //   ...thread.parentThread,
        //   _id: thread.parentThread._id.toString(),
        // },
        user: thread.user && {
          ...thread.user,
          _id: thread.user._id.toString(),
        },
      }),
    );
  } catch (error) {
    console.log('error when getting all posts', error);
  }
};

export const Thread = mongoose.model<IThread, IThreadModel>(
  'Thread',
  threadSchema,
);
