import { pinataKeys } from "./config";


const pinFileToIPFSUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const imageUpload = async (data: FormData): Promise<string> => {
    try {
        if (!data) {
            throw new Error("Image data is empty or invalid.");
        }

        console.log("Starting image upload to Pinata...");

        // Create a request config object
        const config: RequestInit = {
            method: "POST",
            headers: {
                "pinata_api_key": pinataKeys.pinataApiKey || "",
                "pinata_secret_api_key": pinataKeys.pinataSecretApiKey || "",
            },
            body: data,
        };

        // Upload image to Pinata
        const response = await fetch(pinFileToIPFSUrl, config);
        

        // Check if the response is successful
        if (response.ok) {
            const responseData = await response.json();
            const ipfsHash = responseData.IpfsHash;
            console.log("Image uploaded successfully. IPFS Hash:", ipfsHash);
            return ipfsHash;
        } else {
            const errorMessage = await response.text();
            console.error("Failed to upload image to Pinata:", errorMessage);
            throw new Error("Failed to upload image to Pinata: " + errorMessage);
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
