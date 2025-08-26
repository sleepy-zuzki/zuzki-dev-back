import { Transform } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { STACK_AREAS, type StackArea } from '@domain/catalog/types/stack.types';

export class UpdateStackDto {
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
  @IsString()
  @IsIn(STACK_AREAS as unknown as readonly string[])
  area?: StackArea;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string | null;
}
