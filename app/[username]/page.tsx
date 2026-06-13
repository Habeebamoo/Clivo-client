import UserPage from "@/src/components/user-page";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  
  return <UserPage username={resolvedParams.username} />;
}
