import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase and kebab-case (e.g., my-blog-post)',
  })
  @Length(5, 255)
  @Transform(
    ({ value }) =>
      (typeof value === 'string'
        ? value.trim().toLowerCase()
        : value) as string,
  )
  slug!: string;

  @IsOptional()
  content?: any;

  @IsOptional()
  @IsDateString()
  publishDate?: Date;
}
