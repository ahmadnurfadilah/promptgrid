"use client";
import { useUpProvider } from "@/components/up-provider";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { accounts } = useUpProvider();
  const isConnected = accounts && accounts.length > 0;

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-br from-blue-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">PromptGrid</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            The decentralized marketplace for AI prompt engineers on LUKSO blockchain
          </p>
          <p className="text-lg mb-10 max-w-2xl">
            Create, sell, and share AI prompts directly through your Universal Profile on The Grid
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
              {isConnected ? 'Launch App' : 'Connect Universal Profile'}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Monetize Your AI Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-blue-600"><path d="M9.5 4h5L19 8.5v5L14.5 18h-5L5 13.5v-5L9.5 4z"/><circle cx="12" cy="11" r="1"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create</h3>
              <p className="text-gray-600">Design and test professional AI prompts using our intuitive creator tools</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-purple-600"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Monetize</h3>
              <p className="text-gray-600">Set your own pricing and earn LYX tokens every time someone uses your prompts</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-indigo-600"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-600">Showcase your prompts directly on your Universal Profile on The Grid</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Platform Features</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Everything you need to succeed in the AI prompt marketplace
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-blue-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Creator Portal</h3>
                <p className="text-gray-600">Powerful tools for prompt creation, testing, and publishing with Universal Profile authentication</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-purple-600"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                <p className="text-gray-600">Discover, search, and filter prompts by category, price, and user ratings</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-600"><path d="M12 3c.3 0 .6 0 .9.1l3.8 4.2L21 6c.2.2.3.5.3.8 0 .3 0 .6-.1.9l-3.3 4.3v4c0 1-1.1 2-2 2h-8c-.9 0-2-1-2-2v-4L5.5 8c-.2-.3-.2-.6-.2-.9 0-.3.1-.6.3-.8l4-1.3 3.2-3.1c.3 0 .6-.1.9-.1Z"/><path d="M12 17v4"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Control</h3>
                <p className="text-gray-600">Listing fee system, ratings, and reviews to ensure high-quality prompts</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-orange-600"><path d="M3 3v18h18"/><path d="m18 17-5-6-3 4-2-2"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Track usage, revenue, and performance metrics for your prompts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Integration */}
      <section className="w-full py-16 bg-gradient-to-br from-indigo-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Seamless Grid Integration</h2>
              <p className="text-lg mb-6">
                Showcase and sell your prompts directly from your Universal Profile on The Grid
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-300">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Custom widget for Universal Profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-300">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Interactive prompt showcase</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-300">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>One-click prompt usage</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-300">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Seamless payment integration</span>
                </li>
              </ul>
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
                Connect Universal Profile
              </Button>
            </div>
            <div className="md:w-1/2 bg-white/10 rounded-xl p-8 backdrop-blur-sm">
              <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
                <p className="text-center text-gray-300">Grid Widget Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Fee */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Listing Fee Structure</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our listing fee system ensures high-quality submissions and creates a sustainable marketplace
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-blue-600"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Text Prompts</h3>
                <p className="text-3xl font-bold mb-4">5 LYX</p>
                <p className="text-gray-600">Basic text prompts for chatbots and text generation</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-purple-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Image Prompts</h3>
                <p className="text-3xl font-bold mb-4">8 LYX</p>
                <p className="text-gray-600">Advanced prompts for image generation models</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-indigo-600"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Audio/Video</h3>
                <p className="text-3xl font-bold mb-4">10 LYX</p>
                <p className="text-gray-600">Premium prompts for audio and video creation</p>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Benefits of our listing fee system:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 flex-shrink-0 mt-1">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Reduces spam and low-quality submissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 flex-shrink-0 mt-1">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Creates investment incentive for creators to produce quality work</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 flex-shrink-0 mt-1">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Funds platform maintenance and development</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 flex-shrink-0 mt-1">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Possible partial redistribution to top-rated prompt creators</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to monetize your AI prompts?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join PromptGrid today and start earning from your prompt engineering expertise
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-semibold">PromptGrid</p>
              <p className="text-sm">© 2025 PromptGrid. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
