'use client'

import { NextPage } from "next";
import { useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { useRouter } from "next/navigation";
import RegistrationForm from "./components/RegistrationForm";
import { onDataAction, onFormAction } from "./server-action";


const RegisterationPage: NextPage = () => {
  const router = useRouter();
 
  useScaffoldEventSubscriber({
    contractName: "Registry",
    eventName: "AccountRegistration",
    listener: logs => {
      logs.map(log => {
        const { accountsAddress, accountId } = log.args;
        console.log(accountsAddress, accountId);
        router.push(`/dashboard/${accountId}`);
      });
    },
  });

  

  return (
    <div className="flex max-w-full items-center p-2 justify-center flex-col">
        <h1>Registeration</h1>
        <RegistrationForm
          onDataAction={onDataAction}
          onFormAction={onFormAction}
        />  
    </div>
  )
}

export default RegisterationPage;