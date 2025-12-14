import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class UpdateTechnologyDto {
  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Transform(
    ({ value }) =>
      (typeof value === 'string' ? value.trim() : value) as string | undefined,
  )
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 120)
  @Transform(
    ({ value }) =>
      (typeof value === 'string' ? value.trim().toLowerCase() : value) as
        | string
        | undefined,
  )
  slug?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  websiteUrl?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  docsUrl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  iconClass?: string;

  @IsOptional()
  @IsString()
  @Length(4, 7)
  primaryColor?: string;
}
