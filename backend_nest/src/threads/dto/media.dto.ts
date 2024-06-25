import { IsIn, IsNotEmpty, IsOptional, IsUrl, Max } from 'class-validator';
import { IThreadMedia } from 'src/database/thread.models';

export class ThreadMedia implements IThreadMedia {
  @IsNotEmpty()
  @IsUrl({ require_port: false, allow_underscores: true })
  url: string;

  @IsOptional()
  @IsIn(['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'])
  type: string;

  @IsOptional()
  @Max(10000)
  height: number;

  @IsOptional()
  @Max(10000)
  width: number;
}
