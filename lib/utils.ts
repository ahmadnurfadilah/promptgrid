import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: `0x${string}`) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const generationTypes = [
  {
    type: "text",
    label: "Text",
    models: [
      {
        id: "claude",
        name: "Claude",
        versions: [
          {
            id: "3-7-sonnet",
            name: "3.7 Sonnet",
          },
          {
            id: "3-5-sonnet",
            name: "3.5 Sonnet",
          },
          {
            id: "3-5-haiku",
            name: "3.5 Haiku",
          },
        ]
      },
      {
        id: "gpt",
        name: "GPT",
        versions: [
          {
            id: "gpt-4o",
            name: "GPT 4o",
          },
          {
            id: "gpt-4o-mini",
            name: "GPT 4o Mini",
          },
        ]
      },
    ],
  },
  {
    type: "image",
    label: "Image",
    models: [
      {
        id: "chatgpt-image",
        name: "ChatGPT Image",
        versions: [
          {
            id: "4o-image",
            name: "4o Image",
          },
        ]
      },
      {
        id: "dall-e",
        name: "Dall-E",
        versions: [
          {
            id: "dall-e-3",
            name: "Dall-E 3",
          },
          {
            id: "dall-e-2",
            name: "Dall-E 2",
          },
        ],
      },
    ],
  },
  {
    type: "audio",
    label: "Audio",
    models: [],
  },
  {
    type: "video",
    label: "Video",
    models: [],
  },
];
