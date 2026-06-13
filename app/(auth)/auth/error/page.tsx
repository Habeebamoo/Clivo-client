import { Suspense } from "react";
import ErrorPage from "@/src/components/error-page";

export default function Page() {
  return (
    <Suspense>
      <ErrorPage />
    </Suspense>
  );
}