export interface IUser {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    LastName: string;
    avatar: string;
    isVerified: boolean;    
}
 export function getUserDisplayName(user: IUser): string {
    return user.username || user.email || (user.firstName + '.' + user.LastName);
 }