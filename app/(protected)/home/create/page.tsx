"use client";

import CreateArticlePage from "@/src/components/create-article-page";

export default function Page() {
  const handleSaveContent = (data: any) => {
    console.log("Root scope verified article content:", data);
  };

  return <CreateArticlePage saveContent={handleSaveContent} />;
}