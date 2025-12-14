import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class CreateTechnologyDto {
  @IsUUID()
  @IsNotEmpty()
  areaId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 120)
  @Transform(
    ({ value }) =>
      (typeof value === 'string'
        ? value.trim().toLowerCase()
        : value) as string,
  )
  slug!: string;

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
