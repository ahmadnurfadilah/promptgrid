import { UpProvider } from "@/components/up-provider";

export default function GridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UpProvider>
      <div className="w-full min-h-screen bg-indigo-50">{children}</div>
    </UpProvider>
  );
}
