export class ShowcaseImageDto {
  id!: string;
  url!: string;
  type!: string; // slug del tipo de imagen (ej: 'hero-slide', 'gallery')
  order!: number;
}
