"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WalletOptions } from "@/components/wallet-options";
import { useAccount, useDisconnect } from 'wagmi'

type PromptType = "text" | "image" | "audio";

interface PricingTier {
  type: PromptType;
  fee: number;
  description: string;
  icon: React.ReactNode;
}

export default function SellPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [promptType, setPromptType] = useState<PromptType | null>(null);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptDescription, setPromptDescription] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [promptPrice, setPromptPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      type: "text",
      fee: 5,
      description: "Basic text prompts for chatbots and text generation",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-600"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
    {
      type: "image",
      fee: 8,
      description: "Advanced prompts for image generation models",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-600"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      ),
    },
    {
      type: "audio",
      fee: 10,
      description: "Premium prompts for audio and video creation",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-600"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      ),
    },
  ];

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveStep(3); // Move to success step
    }, 2000);
  };

  // Connect wallet if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-sm text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-blue-600"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h1 className="text-2xl font-bold mb-4">Connect Your Universal Profile</h1>
          <p className="text-gray-600 mb-6">
            You need to connect your Universal Profile to create and sell prompts on PromptGrid.
          </p>

          {address ? (
            <button onClick={() => disconnect()}>Disconnect</button>
          ): (
            <WalletOptions />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">Sell Your AI Prompts</h1>
          <p className="text-gray-600 mb-1">
            Create, test, and list your AI prompts on the PromptGrid marketplace
          </p>
          {isConnected && (
            <p className="text-sm text-gray-500">
              Connected as: {address!.slice(0, 6)}...{address!.slice(-4)}
            </p>
          )}
        </div>

        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                1
              </div>
              <span className="text-sm mt-1">Select Type</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                2
              </div>
              <span className="text-sm mt-1">Create Prompt</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                3
              </div>
              <span className="text-sm mt-1">Published</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Step 1: Select Prompt Type */}
            {activeStep === 1 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Select Prompt Type</h2>
                <p className="text-gray-600 mb-6">
                  Choose the type of AI prompt you want to sell. Different prompt types have different listing fees.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {pricingTiers.map((tier) => (
                    <div
                      key={tier.type}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        promptType === tier.type
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setPromptType(tier.type)}
                    >
                      <div className="flex items-center justify-center h-12 mb-3">
                        {tier.icon}
                      </div>
                      <h3 className="font-medium text-center mb-1 capitalize">{tier.type} Prompts</h3>
                      <p className="text-sm text-gray-600 text-center mb-3">{tier.description}</p>
                      <p className="text-center font-semibold">{tier.fee} LYX</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-2">Listing Fee Details</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Listing fees help ensure high-quality prompts by reducing spam and creating
                    an investment incentive for creators to produce their best work.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Funds platform maintenance and development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Partial redistribution to top-rated prompt creators</span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!promptType}
                  onClick={() => setActiveStep(2)}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Create Prompt */}
            {activeStep === 2 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create Your Prompt</h2>
                <p className="text-gray-600 mb-6">
                  Design your {promptType} prompt with a clear title, description and content.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="title">
                        Prompt Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="E.g., Professional Email Writer"
                        value={promptTitle}
                        onChange={(e) => setPromptTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        id="description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="Describe what your prompt does and why it's valuable..."
                        value={promptDescription}
                        onChange={(e) => setPromptDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="content">
                        Prompt Content
                      </label>
                      <textarea
                        id="content"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                        rows={6}
                        placeholder="Enter your actual prompt text here..."
                        value={promptContent}
                        onChange={(e) => setPromptContent(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="price">
                        Price (LYX)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          id="price"
                          className="block w-full pr-12 border-gray-300 rounded-md"
                          placeholder="0.00"
                          value={promptPrice}
                          onChange={(e) => setPromptPrice(Number(e.target.value))}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">LYX</span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Set to 0 for free prompts</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Listing Fee:</span>
                      <span className="font-semibold">{promptType && pricingTiers.find(t => t.type === promptType)?.fee} LYX</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting || !promptTitle || !promptContent}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Pay & Publish'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Success */}
            {activeStep === 3 && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Prompt Published Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Your prompt is now available on the PromptGrid marketplace. You can manage it from your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveStep(1);
                      setPromptType(null);
                      setPromptTitle('');
                      setPromptDescription('');
                      setPromptContent('');
                      setPromptPrice(0);
                    }}
                  >
                    Create Another Prompt
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
