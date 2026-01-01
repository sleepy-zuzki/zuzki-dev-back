import { IsEnum, IsOptional } from 'class-validator';

import { BlogStatus } from '../enums/blog-status.enum';

export class BlogFilterDto {
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}
