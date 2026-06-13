import AppealPage from "@/src/components/appeal-page";

export default function Page({ params }: { params: { userId: string } }) {
  return <AppealPage userId={params.userId} />;
}
