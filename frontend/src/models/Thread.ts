import { IUser } from "./user";

export interface IMedia {
    mediaType: string;
    url: string;
    height: number;
    width: number;
}

export interface IThread {
    _id: string;    
    parentThread: IThread | null;
    user: IUser;
    content: string;
    media: IMedia[]
    replies: IThread[];
    likes: string[];
    createdAt: Date;
}
