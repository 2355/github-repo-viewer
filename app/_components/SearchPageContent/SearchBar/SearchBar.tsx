"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button, TextField } from "@radix-ui/themes";
import { useRef, useState } from "react";

import styles from "./SearchBar.module.css";

type SearchBarProps = {
  defaultValue?: string;
  onSearch: (query: string) => void;
};

export function SearchBar({ defaultValue = "", onSearch }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  return (
    <form
      role="search"
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const value = inputRef.current?.value.trim() ?? "";
        if (value === "") {
          setError("検索キーワードを入力してください");
          return;
        }
        onSearch(value);
      }}
    >
      <TextField.Root
        type="search"
        aria-label="検索キーワード"
        defaultValue={defaultValue}
        placeholder="リポジトリを検索..."
        ref={inputRef}
        size="3"
        onChange={() => {
          if (error) setError("");
        }}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <Button type="submit" size="3">
        検索
      </Button>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}
