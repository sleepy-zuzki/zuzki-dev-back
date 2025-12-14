export interface Technology {
  id: number;
  name: string;
  slug: string;
  website?: string | null;
}

export interface CreateTechnologyInput {
  name: string;
  slug: string;
  website?: string | null;
}

export interface UpdateTechnologyInput {
  name?: string;
  slug?: string;
  website?: string | null;
}
