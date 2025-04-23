"use client";
import { useUpProvider } from "@/components/up-provider";

export default function Home() {
  const { accounts } = useUpProvider();

  return (
    <div>
      <h1>Hello {accounts}</h1>
    </div>
  );
}
