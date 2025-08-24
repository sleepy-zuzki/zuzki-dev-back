import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : (value as string),
  )
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 50)
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as string),
  )
  slug!: string;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsUrl({ require_protocol: true })
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  website?: string | null;
}
