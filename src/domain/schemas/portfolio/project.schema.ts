import { z } from 'zod';

import { PROJECT_CATEGORIES } from '@domain/portfolio/types/project.types';

// Schema for TechnologyRef
export const TechnologyRefSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  website: z.string(),
});
export type TechnologyRef = z.infer<typeof TechnologyRefSchema>;

// Schema for FileRef
export const FileRefSchema = z.object({
  id: z.number(),
  url: z.string(),
  position: z.number().optional().nullable(),
});
export type FileRef = z.infer<typeof FileRefSchema>;

// Schema for Project
export const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  category: z.enum(PROJECT_CATEGORIES).optional().nullable(),
  year: z.number().optional().nullable(),
  isFeatured: z.boolean(),
  technologies: z.array(TechnologyRefSchema),
  previewImage: FileRefSchema.optional().nullable(),
  carouselImages: z.array(FileRefSchema).optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

// Schema for CreateProjectInput
export const CreateProjectInputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  category: z.enum(PROJECT_CATEGORIES).optional().nullable(),
  year: z.number().optional().nullable(),
  isFeatured: z.boolean().optional(),
  technologyIds: z.array(z.number()).optional().nullable(),
  previewImageId: z.number().optional().nullable(),
});
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

// Schema for UpdateProjectInput
export const UpdateProjectInputSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  category: z.enum(PROJECT_CATEGORIES).optional().nullable(),
  year: z.number().optional().nullable(),
  isFeatured: z.boolean().optional(),
  technologyIds: z.array(z.number()).optional().nullable(),
  previewImageId: z.number().optional().nullable(),
});
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
