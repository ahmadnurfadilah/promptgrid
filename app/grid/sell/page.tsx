"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpProvider } from "@/components/up-provider";
import { generationTypes } from "@/lib/utils";
import { AudioLinesIcon, ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Name must be at least 4 characters.",
    })
    .max(40, {
      message: "Name must be less than 40 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must be less than 200 characters.",
    }),
  price: z.number().min(0, {
    message: "Price must be greater than 0.",
  }),
  version: z.string(),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }).max(64000, {
    message: "Prompt must be less than 64000 characters.",
  }),
  example_output: z.string().min(10, {
    message: "Example output must be at least 10 characters.",
  }).max(64000, {
    message: "Example output must be less than 64000 characters.",
  }),
});

export default function Sell() {
  const router = useRouter();
  const { contextAccounts, accounts } = useUpProvider();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [generationType, setGenerationType] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (
      contextAccounts.length > 0 &&
      accounts.length > 0 &&
      contextAccounts[0] !== accounts[0]
    ) {
      router.push("/grid");
    }
  }, [contextAccounts, accounts, router]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="w-full px-5 pb-5 pt-10 @container">
      <div className="text-center mb-5">
        <h1 className="text-2xl font-bold">Sell Your AI Prompts</h1>
        <p className="text-gray-500">
          Create and sell your AI prompts directly through your Universal
          Profile
        </p>
      </div>

      {/* Step Indicator */}
      <div className="w-full mb-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <span className="text-sm text-gray-500 mt-1">Details</span>
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              activeStep >= 2 ? "bg-indigo-600" : "bg-gray-200"
            }`}
          ></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 2
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="text-sm text-gray-500 mt-1">Create Prompt</span>
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              activeStep >= 3 ? "bg-indigo-600" : "bg-gray-200"
            }`}
          ></div>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 3
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
            <span className="text-sm text-gray-500 mt-1">Published</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            {/* Step 1: Select Prompt Type */}
            {activeStep === 1 && (
              <div className="p-6 space-y-4">
                <div>
                  <Label>Generation Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {generationTypes.map((type) => (
                      <button
                        type="button"
                        key={type.type}
                        className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 relative ${
                          generationType === type.type
                            ? "border-indigo-600"
                            : "border-gray-200"
                        }`}
                        onClick={() => setGenerationType(type.type)}
                        disabled={type?.models?.length === 0}
                      >
                        {type.type === "text" && (
                          <TextIcon className="w-4 h-4" />
                        )}
                        {type.type === "image" && (
                          <ImageIcon className="w-4 h-4" />
                        )}
                        {type.type === "audio" && (
                          <AudioLinesIcon className="w-4 h-4" />
                        )}
                        {type.type === "video" && (
                          <VideoIcon className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {type.label}
                        </span>

                        {type.models.length === 0 && (
                          <div className="absolute top-2 right-2 bg-rose-600 text-white px-1 py-0.5 text-[10px] rounded-full">
                            Coming Soon
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {generationType && (
                  <div>
                    <Label>Model</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {generationTypes
                        .find((type) => type.type === generationType)!
                        .models!.map((m) => (
                          <button
                            type="button"
                            key={m.id}
                            className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer text-sm font-medium ${
                              m.id === model
                                ? "border-indigo-600"
                                : "border-gray-200"
                            }`}
                            onClick={() => setModel(m.id)}
                          >
                            {m.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your prompt name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your prompt price"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your prompt description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div></div>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setActiveStep(2)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Create Prompt */}
            {activeStep === 2 && (
              <div className="p-6 space-y-4">
                {model && (
                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Version</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select version</option>
                            {generationTypes
                              .find(type => type.type === generationType)
                              ?.models.find(m => m.id === model.toLowerCase())
                              ?.versions.map(version => (
                                <option key={version.id} value={version.id}>
                                  {version.name}
                                </option>
                              ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

								<FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt template</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-24"
                          placeholder="Create a compelling newsletter for our [audience] on [topic]."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Put any variables in [square brackets].</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="example_output"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Example output</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-24"
                          placeholder="Create a compelling newsletter for our [audience] on [topic]."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
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
                    onClick={() => router.push('/grid/dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/grid/id')}
                  >
                    See the prompt
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
