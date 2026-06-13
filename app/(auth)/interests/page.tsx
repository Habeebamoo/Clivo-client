import { Suspense } from "react";
import InterestsPage from "@/src/components/interests-page";

export default function Page() {
  return (
    <Suspense>
      <InterestsPage />
    </Suspense>
  );
}