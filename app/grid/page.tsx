/* eslint-disable @next/next/no-img-element */
"use client";

import { useUpProvider } from "@/components/up-provider";
import { formatAddress } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const prompts = [
  {
    id: 1,
    type: "text",
    title: "Prompt 1",
    description: "Description 1",
    price: 5,
    image: "https://placehold.co/400",
  },
  {
    id: 2,
    type: "image",
    title: "Prompt 2",
    description: "Description 2",
    price: 5,
    image: "https://placehold.co/400",
  },
  {
    id: 3,
    type: "video",
    title: "Prompt 3",
    description: "Description 3",
    price: 5,
    image: "https://placehold.co/400",
  },
  {
    id: 4,
    type: "audio",
    title: "Prompt 4",
    description: "Description 4",
    price: 5,
    image: "https://placehold.co/400",
  },
];

export default function Grid() {
  const { contextAccounts, accounts } = useUpProvider();

  return (
    <div className="w-full px-4 pb-4 pt-10 @container">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Prompts</h1>
        <p className="text-gray-500">
          Browse through all prompts created by{" "}
          {contextAccounts.length > 0
            ? formatAddress(contextAccounts[0])
            : "this creator"}
          .
        </p>
      </div>

      {contextAccounts.length > 0 && accounts.length > 0 && (
        <>
            {contextAccounts[0] === accounts[0] && (
                <div className="fixed bottom-4 right-4 z-10">
                    <Link href="/grid/sell" className="bg-indigo-600 text-white size-12 rounded-full flex items-center justify-center shadow hover:shadow-xl hover:bg-indigo-700 transition-all">
                        <PlusIcon />
                    </Link>
                </div>
            )}
        </>
      )}

      {prompts.length > 0 ? (
        <div className="grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4 gap-5">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={prompt.image}
                alt={prompt.title}
                className="w-full aspect-[3/2] object-cover object-center"
              />
              <div className="p-2.5">
                <h2 className="font-semibold">{prompt.title}</h2>
                <p className="text-xs text-gray-500">{prompt.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center w-full aspect-video border-4 border-dashed border-gray-200 rounded-md flex items-center justify-center">
          <p className="text-gray-500">No prompts found.</p>
        </div>
      )}
    </div>
  );
}
