import { z } from "zod";

export const ownerSchema = z.object({
  login: z.string(),
  avatar_url: z.url(),
});

export type Owner = z.infer<typeof ownerSchema>;

export const repositorySchema = z.object({
  name: z.string(),
  full_name: z.string(),
  owner: ownerSchema,
  description: z.nullable(z.string()),
  language: z.nullable(z.string()),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  html_url: z.url(),
  updated_at: z.string(),
});

export type Repository = z.infer<typeof repositorySchema>;

export const searchRepositoriesResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(repositorySchema),
});

export type SearchRepositoriesResponse = z.infer<
  typeof searchRepositoriesResponseSchema
>;
