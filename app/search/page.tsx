import { Suspense } from "react";

import { SearchPageContent } from "./_components/SearchPageContent/SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  );
}
