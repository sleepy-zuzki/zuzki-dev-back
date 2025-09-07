import { IsInt, IsOptional, Min } from 'class-validator';

export class AddImageToCarouselDto {
  @IsInt()
  @Min(1)
  fileId!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
