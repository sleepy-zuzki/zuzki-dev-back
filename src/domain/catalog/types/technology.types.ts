export interface Technology {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface CreateTechnologyInput {
  name: string;
  slug: string;
  description?: string | null;
}

export interface UpdateTechnologyInput {
  name?: string;
  slug?: string;
  description?: string | null;
}
