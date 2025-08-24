import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdateTechnologyDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 50)
  @Transform(({ value }): string | undefined =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  slug?: string;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsUrl({ require_protocol: true })
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  website?: string | null;
}
