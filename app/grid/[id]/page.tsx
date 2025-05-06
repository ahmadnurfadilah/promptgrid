/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from "@/lib/abi/promptgrid.json";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AudioLinesIcon, ChevronDown, CircleXIcon, ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpProvider } from "@/components/up-provider";

export default function Prompt() {
	const { id } = useParams();
	const router = useRouter();
  const { accounts, provider } = useUpProvider();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [promptType, setPromptType] = useState<number>(0);
  const [price, setPrice] = useState<string>("");
	const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const web3Readonly = new Web3(process.env.NEXT_PUBLIC_LUKSO_RPC || "https://rpc.testnet.lukso.network");
      const contractReadonly = new web3Readonly.eth.Contract(ABI, process.env.NEXT_PUBLIC_PROMPTGRID_NFT_CONTRACT_ADDRESS!);
      const getData = await contractReadonly.methods.getDataForTokenId(Web3.utils.padLeft(Web3.utils.numberToHex(id as string), 64), '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e').call();
      const promptDetails = await contractReadonly.methods.getPromptDetails(Web3.utils.padLeft(Web3.utils.numberToHex(id as string), 64)).call();

      // Set promptType and price from promptDetails
      if (promptDetails) {
        setPromptType(Number(promptDetails[0]));
        setPrice(web3Readonly.utils.fromWei(promptDetails[1], 'ether'));

				if (promptDetails[2] === "") {
					setNotFound(true);
				}
      } else {
					setNotFound(true);
			}

      if (getData) {
        // @ts-expect-error - getData is not defined
        let data = Web3.utils.hexToUtf8(getData);
        data = data.search(`data:application/json;`) > -1 ? data.slice(data.search(`data:application/json;`), data.length) : `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}` + data.slice(data.search(`ipfs://`), data.length).replace(`ipfs://`, '')

        fetch(data)
        .then((res) => res.json())
        .then((dataContent) => {
            if (dataContent.LSP4Metadata) {
              setName(dataContent.LSP4Metadata.name || "");
              setDescription(dataContent.LSP4Metadata.description || "");

              // Get image URL from images array if available
              if (dataContent.LSP4Metadata.images && dataContent.LSP4Metadata.images.length > 0) {
                const imageUrl = dataContent.LSP4Metadata.images[0].url;
                // Convert IPFS URL to gateway URL if needed
                const formattedImageUrl = imageUrl.startsWith('ipfs://')
                  ? `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${imageUrl.replace('ipfs://', '')}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`
                  : imageUrl;
                setImage(formattedImageUrl);
              }
            }
        })
				.catch((err) => {
					console.log(err);
					setNotFound(true);
				});
      }
    }

    getData();
  }, [id]);

	const purchasePrompt = async () => {
		// @ts-expect-error - provider is not defined in the window object
		const web3Readonly = new Web3(provider);
		const contract = new web3Readonly.eth.Contract(ABI, process.env.NEXT_PUBLIC_PROMPTGRID_NFT_CONTRACT_ADDRESS!);

		const tokenId = Web3.utils.padLeft(Web3.utils.numberToHex(id as string), 64);

		try {
			let purchase;
			if (price === '0') {
				// Handle free prompts without sending value
				purchase = await contract.methods.purchasePrompt(tokenId).send({
					from: accounts[0],
				});
			} else {
				const weiValue = web3Readonly.utils.toWei(price, "ether");

				// Send the transaction with exact Wei value
				purchase = await contract.methods.purchasePrompt(tokenId).send({
					from: accounts[0],
					value: weiValue,
				});
			}

			console.log("purchase", purchase);
		} catch (error) {
			console.error("Purchase error:", error);
			throw error;
		}
	}

  return (
    <div className="w-full h-screen relative @container">
			{image && (
      	<img src={image} alt={name} className="w-full h-full object-cover" />
			)}

			{!notFound ? (
				<>
					<div className="absolute top-6 left-6">
						<div>
							{promptType === 1 && (
								<div className="bg-gray-900 text-white px-2 py-1 rounded-md">
									<TextIcon className="w-4 h-4" />
								</div>
							)}
							{promptType === 2 && (
								<div className="bg-gray-900 text-white px-2 py-1 rounded-md">
									<ImageIcon className="w-4 h-4" />
								</div>
							)}
							{promptType === 3 && (
								<div className="bg-gray-900 text-white px-2 py-1 rounded-md">
									<AudioLinesIcon className="w-4 h-4" />
								</div>
							)}
							{promptType === 4 && (
								<div className="bg-gray-900 text-white px-2 py-1 rounded-md">
									<VideoIcon className="w-4 h-4" />
								</div>
							)}
						</div>
					</div>

					<div className="absolute bottom-0 inset-x-0 bg-black/20 backdrop-blur-sm p-2 @md:p-3">
						<div className="flex items-center justify-between gap-2">
							<Sheet>
								<SheetTrigger className="flex items-center gap-1">
									<ChevronDown className="w-4 h-4 text-white" />
									<span className="text-white text-base font-bold line-clamp-1">{name}</span>
								</SheetTrigger>
								<SheetContent side="bottom" className="max-h-[85vh] overflow-auto">
									<SheetHeader>
										<SheetTitle>{name}</SheetTitle>
										<SheetDescription>
											{description}
											{promptType > 0 && (
												<div className="mt-4">
													<p><strong>Type:</strong> {promptType === 1 ? 'Text' : promptType === 2 ? 'Image' : promptType === 3 ? 'Audio' : 'Video'}</p>
													<p><strong>Price:</strong> {price === '0' ? 'Free' : `${price} LYX`}</p>
												</div>
											)}
										</SheetDescription>
									</SheetHeader>
								</SheetContent>
							</Sheet>

							<div className="flex items-center gap-1">

								<Sheet>
								<SheetTrigger>
									<Button className="bg-indigo-600 hover:bg-indigo-700">
										Try it out
									</Button>
								</SheetTrigger>
								<SheetContent side="bottom" className="max-h-[85vh] overflow-auto">
									<SheetHeader>
										<SheetTitle>Purchase Prompt</SheetTitle>
										<SheetDescription>
											<p className="mb-4">Purchase this prompt for {price === '0' ? 'Free' : `${price} LYX`} to use it. The result will show immediately.</p>

											<Button onClick={purchasePrompt}>
												Purchase
											</Button>
										</SheetDescription>
									</SheetHeader>
								</SheetContent>
							</Sheet>
							</div>
						</div>
					</div>
				</>
			) : (
				<div className="w-full h-full flex items-center justify-center">
					<div>
						<CircleXIcon className="w-10 h-10 text-red-600 mx-auto mb-1" />
						<p className="text-center text-sm mb-4">Prompt not found</p>
						<Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push("/grid/sell")}>
							Create Prompt
						</Button>
					</div>
				</div>
			)}
    </div>
  );
}
