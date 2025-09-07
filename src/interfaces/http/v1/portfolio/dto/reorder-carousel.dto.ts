import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

class CarouselImageOrder {
  @IsInt()
  @Min(1)
  fileId!: number;

  @IsInt()
  @Min(0)
  position!: number;
}

export class ReorderCarouselDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarouselImageOrder)
  images!: CarouselImageOrder[];
}
