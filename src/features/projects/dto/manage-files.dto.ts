import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AttachFileDto {
  @IsUUID()
  @IsNotEmpty()
  fileId!: string;

  @IsString()
  @IsNotEmpty()
  contextSlug!: string; // 'cover', 'hero-slide', 'gallery'

  @IsInt()
  @IsOptional()
  order?: number;
}

class FileOrderItem {
  @IsUUID()
  @IsNotEmpty()
  fileId!: string;

  @IsInt()
  @IsNotEmpty()
  order!: number;
}

export class ReorderFilesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileOrderItem)
  items!: FileOrderItem[];
}

export class UpdateFileContextDto {
  @IsString()
  @IsNotEmpty()
  contextSlug!: string;
}
