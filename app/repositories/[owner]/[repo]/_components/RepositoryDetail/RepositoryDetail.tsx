import { Badge, Card } from "@radix-ui/themes";
import Image from "next/image";

import type { Repository } from "@/infra/github/types";

import styles from "./RepositoryDetail.module.css";

type RepositoryDetailProps = {
  repository: Repository;
};

export function RepositoryDetail({ repository }: RepositoryDetailProps) {
  const {
    full_name,
    owner,
    description,
    language,
    stargazers_count,
    watchers_count,
    forks_count,
    open_issues_count,
    html_url,
  } = repository;

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <Image
          src={owner.avatar_url}
          alt={owner.login}
          width={64}
          height={64}
          className={styles.avatar}
        />
        <div className={styles.headerInfo}>
          <h1 className={styles.heading}>
            <a
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {full_name}
            </a>
          </h1>
          {language && <Badge size="2">{language}</Badge>}
        </div>
      </div>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {stargazers_count.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Stars</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {watchers_count.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Watchers</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {forks_count.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Forks</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {open_issues_count.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Issues</span>
        </div>
      </div>
    </Card>
  );
}
