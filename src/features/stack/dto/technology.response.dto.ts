export class TechnologyResponseDto {
  id!: string;
  areaId!: string;
  name!: string;
  slug!: string;
  websiteUrl?: string | null;
  docsUrl?: string | null;
  iconClass?: string | null;
  primaryColor?: string | null;
  createdAt!: string;
  updatedAt!: string;
}
