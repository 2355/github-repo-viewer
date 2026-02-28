import { notFound } from "next/navigation";

import { getRepository } from "@/infra/github/client";

import { RepositoryDetail } from "./_components/RepositoryDetail/RepositoryDetail";

type Params = {
  params: Promise<{ owner: string; repo: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { owner, repo } = await params;
  return { title: `${owner}/${repo}` };
}

export default async function RepositoryPage({ params }: Params) {
  const { owner, repo } = await params;
  const result = await getRepository(owner, repo);

  if (!result.ok) {
    if (result.error.status === 404) {
      notFound();
    }
    throw new Error(result.error.message);
  }

  return <RepositoryDetail repository={result.data} />;
}
