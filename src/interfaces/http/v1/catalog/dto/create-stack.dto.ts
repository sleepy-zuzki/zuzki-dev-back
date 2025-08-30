import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

import { STACK_AREAS, type StackArea } from '@domain/catalog/types/stack.types';

export class CreateStackDto {
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

  @IsString()
  @IsIn(STACK_AREAS as unknown as readonly string[])
  area!: StackArea;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }): string | null | undefined =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string | null;
}
