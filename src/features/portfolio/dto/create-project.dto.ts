import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
} from '../dto/project.schema';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : (value as string),
  )
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 160)
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as string),
  )
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  details?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  repoUrl?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  liveUrl?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(PROJECT_CATEGORIES as unknown as readonly string[])
  category?: ProjectCategory | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number | null;

  @IsOptional()
  @Transform(({ value }): boolean | undefined | null => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return value as boolean | undefined | null;
  })
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  technologyIds?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  previewImageId?: number | null;
}
