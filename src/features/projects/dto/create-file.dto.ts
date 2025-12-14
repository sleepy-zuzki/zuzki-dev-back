import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : (value as string),
  )
  url!: string;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsString()
  @MaxLength(50)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  provider?: string | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsString()
  @MaxLength(100)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  mimeType?: string | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sizeBytes?: number | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId?: number | null;
}
