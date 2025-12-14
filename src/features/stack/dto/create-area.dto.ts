import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateAreaDto {
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
  @IsString()
  @Length(1, 50)
  @Transform(
    ({ value }) =>
      (typeof value === 'string' ? value.trim() : value) as string | undefined,
  )
  iconCode?: string;
}
