import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import type { EditorJsContent } from '@shared/types/editor-js-content.type';

export class CreateShowcaseDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 160)
  @Transform(
    ({ value }) =>
      (typeof value === 'string'
        ? value.trim().toLowerCase()
        : value) as string,
  )
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(
    ({ value }) =>
      (typeof value === 'string' ? value.trim() : value) as string | undefined,
  )
  description?: string;

  @IsOptional()
  content?: EditorJsContent;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  repoUrl?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  liveUrl?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  technologyIds?: string[];
}
