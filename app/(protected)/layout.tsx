import Header from "@/src/components/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header type="home" />
      <div className="mt-18">{children}</div>
    </>
  );
}
