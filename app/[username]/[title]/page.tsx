import ArticlePage from "@/src/components/article-page";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    username: string;
    title: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, title } = await params;
  const decodedUsername = decodeURIComponent(username);
  const decodedTitle = decodeURIComponent(title).replace(/-/g, " ");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${decodedUsername}/${title}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error();

    const response = await res.json();
    const article = response.data;
    console.log("Article metadata:", article.picture);

    return {
      title: article.title,
      description: article.authorBio
        ? `By ${article.authorFullname} · ${article.authorBio}`
        : `By ${article.authorFullname} on Clivo`,
      openGraph: {
        title: article.title,
        description: article.authorBio
          ? `By ${article.authorFullname} · ${article.authorBio}`
          : `By ${article.authorFullname} on Clivo`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${username}/${title}`,
        siteName: "Clivo",
        type: "article",
        publishedTime: article.createdAt,
        authors: [article.authorFullname],
        ...(article.picture && {
          images: [
            {
              url: article.picture,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ],
        }),
      },
      twitter: {
        card: article.picture ? "summary_large_image" : "summary",
        title: article.title,
        description: article.authorBio
          ? `By ${article.authorFullname} · ${article.authorBio}`
          : `By ${article.authorFullname} on Clivo`,
        ...(article.picture && { images: [article.picture] }),
      },
    };
  } catch {
    // fallback metadata if fetch fails
    return {
      title: decodedTitle,
      description: `Read "${decodedTitle}" on Clivo`,
      openGraph: {
        title: decodedTitle,
        description: `Read "${decodedTitle}" on Clivo`,
        siteName: "Clivo",
        type: "article",
      },
      twitter: {
        card: "summary",
        title: decodedTitle,
        description: `Read "${decodedTitle}" on Clivo`,
      },
    };
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <ArticlePage
      username={resolvedParams.username}
      title={resolvedParams.title}
    />
  );
}