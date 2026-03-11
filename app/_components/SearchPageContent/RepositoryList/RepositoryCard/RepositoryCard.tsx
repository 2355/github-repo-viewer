import { Card } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

import type { Repository } from "@/infra/github/types";

import styles from "./RepositoryCard.module.css";

type RepositoryCardProps = {
  repository: Repository;
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const { name, owner } = repository;

  return (
    <Card asChild size="2" className={styles.card}>
      <Link
        href={`/repositories/${owner.login}/${name}`}
        className={styles.link}
      >
        <Image
          src={owner.avatar_url}
          alt={owner.login}
          width={40}
          height={40}
          className={styles.avatar}
        />
        <span className={styles.name}>{name}</span>
      </Link>
    </Card>
  );
}
