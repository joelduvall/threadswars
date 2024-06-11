import { IThreadMedia } from 'src/database/thread.models';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsNotEmptyIfExists } from 'src/validation/is-not-empty-if-exists.validator';

export class CreateThreadDto {
  @IsNotEmptyIfExists()
  parentThreadId?: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  media: IThreadMedia[];
}
