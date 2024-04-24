
import { config } from "dotenv";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

config();
 
export const pinataKeys = {
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
}


  // Local Account
  export const adminAccount = privateKeyToAccount(
    process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`
);


  
  export const walletClient = createWalletClient({
    chain: hardhat,
    account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`),
    transport: http(), 
  });
  
  export const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  


  