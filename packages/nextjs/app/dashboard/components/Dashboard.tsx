
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import VendorDashboard from "./VendorDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = ({ accountId }: { accountId: bigint }) => {
  const router = useRouter();
  const { address } = useAccount();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const { data: userData, error: loadingError } = useScaffoldContractRead({
    contractName: "Registry",
    functionName: "getAccountById",
    args: [accountId],
  });
  
  
  const { data: VENDOR } = useScaffoldContractRead({
    contractName: "Manager",
    functionName: "VENDOR_ROLE"
  });


  const { data: isVendor } = useScaffoldContractRead({
    contractName: "Manager",
    functionName: "hasRole",
    args: [VENDOR, address],
  });
 
  useEffect(() => {
    if (userData) {
      setUser(userData);
      
      if (address && userData.verifiedAddresses) {
        if (address === userData.verifiedAddresses[0]) {
          setIsVerified(true);
        } else if (userData.verifiedAddresses.includes(address)) {
          setIsVerified(true);
          // Record the visit
        } else {
          setIsVerified(false);
        }
      }
    }
  }, [address, userData]);


  
  return (
    <div>
      <div>
        {loadingError ? (
          <div className="text-center">
            <p>Oops! Something went wrong while fetching your account details.</p>
            <p>Please verify your account or contact support.</p>
            <button onClick={() => router.push('/')}>Go Home</button>
          </div>
        ) : (
          <div>
            {isVerified === null ? (
              <p className="text-center">Loading...</p>
            ) : isVerified ? (
              <div>
                <h2 className="text-right font-mono pr-2 text-sm">Hello {user && user.name}</h2>
                {user && isVendor && isVendor[0] === true ? (
                  <VendorDashboard />
                ) : (
                  <UserDashboard />
                )}
              </div>
            ) : (
              <div className="text-center">
                <p>Your address is not verified.</p>
                <p>Please verify your account or contact support.</p>
                <button onClick={() => router.push('/')}>Go Home</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;