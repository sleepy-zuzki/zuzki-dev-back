import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
} from '@domain/portfolio/types/project.types';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 160)
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  slug?: string;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  repoUrl?: string | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
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
  @ValidateIf((_o, v) => v !== null)
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  technologyIds?: number[] | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  previewImageId?: number | null;
}
