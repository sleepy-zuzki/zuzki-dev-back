import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateAreaDto {
  @IsOptional()
  @IsString()
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
  @IsString()
  @Length(1, 50)
  @Transform(
    ({ value }) =>
      (typeof value === 'string' ? value.trim() : value) as string | undefined,
  )
  iconCode?: string;
}
