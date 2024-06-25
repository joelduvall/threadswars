import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsNotEmptyIfExists } from 'src/validation/is-not-empty-if-exists.validator';
import { ThreadMedia } from './media.dto';

export class CreateThreadDto {
  @IsOptional()
  @IsNotEmptyIfExists()
  parentThreadId?: string;

  @ValidateIf((o) => !o.media || o.media.length === 0)
  @IsOptional()
  content?: string;

  @IsOptional()
  userId?: string;

  @ValidateIf((o) => !o.content || o.content.length === 0)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsOptional()
  @Type(() => ThreadMedia)
  media?: Array<ThreadMedia>;
}
