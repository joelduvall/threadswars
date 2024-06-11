import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  email?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
  authProvider: string;
  username?: string;
  avatar?: string;
}
