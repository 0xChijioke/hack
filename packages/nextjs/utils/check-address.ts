'use server'

import { publicClient } from './client';
import deployedContracts from '../contracts/deployedContracts';


export const checkAddress = async ({ address }: { address: string }) => {
    try {
        const registeredUser = await publicClient.readContract({
            address: deployedContracts[31337].Registry.address,
            abi: deployedContracts[31337].Registry.abi,
            functionName: 'getAccount',
            args: [address]
        });
        return registeredUser;
    } catch (error) {
        console.error('Error checking address:', error);
        throw error;
    }
};
 