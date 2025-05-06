/* eslint-disable @next/next/no-img-element */
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
import toast from "react-hot-toast";
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
import ABI from "@/lib/abi/promptgrid.json";
import Web3 from "web3";
import axios from "axios";

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
  price: z.string(),
  version: z.string(),
  prompt: z
    .string()
    .min(10, {
      message: "Prompt must be at least 10 characters.",
    })
    .max(64000, {
      message: "Prompt must be less than 64000 characters.",
    }),
  example_output: z
    .string()
    .min(10, {
      message: "Example output must be at least 10 characters.",
    })
    .max(64000, {
      message: "Example output must be less than 64000 characters.",
    }),
  image: z.instanceof(FileList).optional(),
});

export default function Sell() {
  const router = useRouter();
  const { contextAccounts, accounts, provider } = useUpProvider();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [generationType, setGenerationType] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [listingFee, setListingFee] = useState<string>("0.005");
  const [tokenIdCounter, setTokenIdCounter] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
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

  useEffect(() => {
    const getTokenIdCounter = async () => {
      const web3Readonly = new Web3(process.env.NEXT_PUBLIC_LUKSO_RPC || "https://rpc.testnet.lukso.network");
      const contractReadonly = new web3Readonly.eth.Contract(ABI, process.env.NEXT_PUBLIC_PROMPTGRID_NFT_CONTRACT_ADDRESS!);
      const tokenIdCounter = await contractReadonly.methods.getTokenIdCounter().call();
      setTokenIdCounter(Number(tokenIdCounter));
    }

    getTokenIdCounter();
  }, []);

  // TODO: Get the listing fee from the contract
  useEffect(() => {
    if (generationType === "text") {
      setListingFee("0.001");
    } else if (generationType === "image") {
      setListingFee("0.002");
    } else if (generationType === "audio") {
      setListingFee("0.003");
    } else if (generationType === "video") {
      setListingFee("0.004");
    }
  }, [generationType]);

  const uploadToIPFS = async (file: File): Promise<string> => {
    try {
      // Create form data for the file
      const formData = new FormData();
      formData.append("file", file);

      const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

      const response = await axios.post(pinataEndpoint, formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY || "",
          pinata_secret_api_key:
            process.env.NEXT_PUBLIC_PINATA_API_SECRET || "",
        },
      });

      if (response.data && response.data.IpfsHash) {
        return `ipfs://${response.data.IpfsHash}`;
      } else {
        throw new Error("Failed to upload to IPFS");
      }
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const images = [];
      let ipfsUrl = "";

      // @ts-expect-error - provider is not defined in the window object
      const web3 = new Web3(provider);

      // Upload the image to IPFS if it exists
      if (values.image && values.image.length > 0) {
        const file = values.image[0];

        // Upload to Pinata/IPFS
        try {
          ipfsUrl = await uploadToIPFS(file);
          console.log("IPFS URL:", ipfsUrl);

          // Hash the file for verification
          const arrayBuffer = await file.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);
          const imageHash = web3.utils.keccak256(buffer);

          // Add image to metadata
          images.push({
            width: 1024,
            height: 1024,
            url: ipfsUrl,
            verification: {
              method: "keccak256(bytes)",
              data: imageHash,
            },
          });
        } catch (error) {
          console.error("Failed to upload image to IPFS:", error);
          toast.error("Failed to upload image to IPFS. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare metadata for NFT
      const metadata = JSON.stringify({
        LSP4Metadata: {
          name: values.name,
          description: values.description,
          exampleOutput: values.example_output || "",
          links: [
            { title: "Try it out", url: `https://promptgrid.vercel.app/grid/${tokenIdCounter + 1}` },
          ],
          attributes: [
            { key: "Type", value: generationType },
            { key: "Model", value: model },
            { key: "Version", value: values.version },
          ],
          icon: [],
          backgroundImage: [],
          assets: [],
          images: images,
        },
      });

      // Convert price to wei (assuming it's in LYX)
      const priceInWei = web3.utils.toWei(values.price.toString(), "ether");

      // Get the prompt type ID based on generationType
      let promptTypeId = 1; // Default to TEXT_PROMPT
      if (generationType === "image") promptTypeId = 2; // IMAGE_PROMPT
      if (generationType === "audio") promptTypeId = 3; // AUDIO_PROMPT
      if (generationType === "video") promptTypeId = 4; // VIDEO_PROMPT

      // Get contract address from environment variable
      const contractAddress =
        process.env.NEXT_PUBLIC_PROMPTGRID_NFT_CONTRACT_ADDRESS!;

      // Initialize contract
      const contract = new web3.eth.Contract(ABI, contractAddress);

      // Call createPrompt method
      const result = await contract.methods
        .createPrompt(
          promptTypeId,
          values.prompt,
          priceInWei,
          metadata
        )
        .send({
          from: accounts[0],
          value: web3.utils.toWei(listingFee, "ether"),
        });

      console.log("Transaction result:", result);

      // If successful, move to the next step
      setActiveStep(3);
    } catch (error) {
      console.error("Error creating prompt:", error);
      toast.error("Failed to create prompt. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
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
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter your prompt price"
                              className="pr-12"
                              {...field}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                              LYX
                            </div>
                          </div>
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

                <FormField
                  control={form.control}
                  name="image"
                  render={({
                    field: { onChange, name, onBlur, ref, disabled },
                  }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e);
                            }}
                            name={name}
                            onBlur={onBlur}
                            ref={ref}
                            disabled={disabled}
                          />
                          {imagePreview && (
                            <div className="mt-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-32 border rounded-md"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div></div>
                  <Button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      if (!generationType) {
                        toast.error("Please select a generation type");
                        return;
                      }
                      if (!model) {
                        toast.error("Please select a model");
                        return;
                      }
                      setActiveStep(2);
                    }}
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
                              .find((type) => type.type === generationType)
                              ?.models.find((m) => m.id === model.toLowerCase())
                              ?.versions.map((version) => (
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
                      <FormDescription>
                        Put any variables in [square brackets].
                      </FormDescription>
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
                  <Button variant="outline" onClick={() => setActiveStep(1)}>
                    Back
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {activeStep === 3 && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Prompt Published Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Copy this link to your GRID: https://promptgrid.vercel.app/grid/{tokenIdCounter + 1}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/grid/${tokenIdCounter + 1}`)}
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
