'use server'

import { z } from "zod";
import { itemSchema } from "./ItemSchema";
import { pinataKeys, publicClient } from "~~/utils/config";
import deployedContracts from "~~/contracts/deployedContracts";
import { getWalletClient } from "@wagmi/core";

const pinJSONToIPFSUrl = process.env.NEXT_PUBLIC_PIN_JSON;


export type FormState = {
    message: string;
};



export const onFormAction = async (
    prevState: {
      message: string;
      item?: z.infer<typeof itemSchema>;
      issues?: string[];
    },
    formData: FormData,
) => {
    try {
        const data = Object.fromEntries(formData);
        const parsed = await itemSchema.safeParseAsync(data);

        if (!parsed.success) {
            return {
                message: "Invalid data",
                issues: parsed.error.issues.map((issue) => issue.message),
            };
        }

        const ipfsHash = await pinJsonToIPFS(constructTokenJson(parsed.data, data.imageSrc as string));
        console.log("Item registered. IPFS Hash:", ipfsHash);
        
        const tx = await addItemAndTokenize(
            parsed.data.name,
            parsed.data.description,
            BigInt(parsed.data.price),
            BigInt(parsed.data.quantity),
            ipfsHash,
            data.address as string
        )
      

      return { message: `Item added successfully. IPFS Hash: ${ipfsHash}`, item: parsed.data };

        
    } catch (error) {
        console.error("Error processing form data:", error);
        return { message: "Failed to add item. Please try again later." };
    }
};

const constructTokenJson = (data: any, image: string) => {
    const { name, description, price, quantity } = data;

    // Construct the JSON object
    const token: any = {
        name,
        description,
        image,
        attributes: [],
    };

    return token;
};

const pinJsonToIPFS = async (tokenJson: any) => {
    try {
        console.log("Pinning token JSON to IPFS...");
        
        // Create a request config object
        const config: RequestInit = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "pinata_api_key": pinataKeys.pinataApiKey || "",
              "pinata_secret_api_key": pinataKeys.pinataSecretApiKey || "",
          },
          body: JSON.stringify(tokenJson),
      };

      // Pin the token JSON to IPFS
      const response = await fetch(pinJSONToIPFSUrl!, config);

        // Check if the response is successful
        if (response.ok) {
            const responseData = await response.json();
            const ipfsHash = responseData.IpfsHash;
            console.log("Token JSON pinned to IPFS. IPFS Hash:", ipfsHash);
            return ipfsHash;
        } else {
            const errorMessage = await response.text();
            console.error("Failed to pin token JSON to IPFS:", errorMessage);
            throw new Error("Failed to pin token JSON to IPFS: " + errorMessage);
        }
    } catch (error) {
        console.error("Error pinning token JSON to IPFS:", error);
        throw error;
    }
};



const addItemAndTokenize = async (name: string, description: string, price: bigint, quantity: bigint, ipfsHash: string, address: string) => {
    try {
        console.log("Started registeration of item on the contract...");
        const walletClient = await getWalletClient({ chainId: 31337 });
        
        const { request } = await publicClient.simulateContract({
            address: deployedContracts[31337].VendorOps.address,
            abi: deployedContracts[31337].VendorOps.abi,
            functionName: 'addItemAndTokenize',
            args: [name, description, '', ipfsHash, price, quantity],
            account: address,
        })
        // console.log("request", request)
    
            
    
        const register = await walletClient!.writeContract(request);
        // console.log("register", register);
      
      
        
      const decodedData = await publicClient.getContractEvents({
          address: deployedContracts[31337].VendorOps.address,
          abi: deployedContracts[31337].VendorOps.abi,
          eventName: 'ItemAdded',
      });
    //   console.log("decodedData", decodedData);
  

    } catch (error) {
        console.error("Error adding item and tokenizing:", error);
        throw error;
    }
};