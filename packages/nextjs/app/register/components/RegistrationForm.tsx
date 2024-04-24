'use client'

import { useFormState } from "react-dom";
import { schema } from './RegistrationSchema'
import { useAccount } from 'wagmi';
import { Button } from "../../components/ui/Button";
import { AddressInput } from '~~/components/scaffold-eth';
import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~~/app/components/ui/Form";
import { Input } from "~~/app/components/ui/Input";
import { Label } from "~~/app/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "~~/app/components/ui/RadioGroup";

const RegistrationForm = ({
    onDataAction,
    onFormAction,
}: {
    onDataAction: (data: z.infer<typeof schema>) => Promise<{       
      message: string;
      user?: z.infer<typeof schema>;
      issues?: string[];
    }>;
    onFormAction: (
      prevState: {
        message: string;
        user?: z.infer<typeof schema>;
        issues?: string[];
      },
      data: FormData
    ) => Promise<{
      message: string;
      user?: z.infer<typeof schema>;
      issues?: string[];
    }>;
    }) => {
    
    const [state, formAction] = useFormState(onFormAction, {
      message: "",
    });
    
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: "",
        email: "",
        address: "",
        vendor: "",
      },
    });
    const { address: connectedAddress } = useAccount();
    

    
    const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
        <div className="flex flex-col gap-y-3 justify-center w-full lg:w-1/3 p-3">
            <Form {...form}>
                <div>{state?.message}</div>
                <form
                    ref={formRef}
                    action={formAction}
                    onSubmit={(evt) => {
                    evt.preventDefault();
                    form.handleSubmit(() => {
                        const formData = new FormData(formRef.current!);
                        formAction(formData);
                    })(evt);
                    }}
                    className="space-y-8"
                >
                    <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                            <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>Your name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <AddressInput
                                    // className="input input-bordered w-full rounded-lg"
                                    name="address"
                                    placeholder={connectedAddress || ''}
                                    value={connectedAddress || ''}
                                    onChange={(e) => form.setValue("address", e)}
                                />
                            </FormControl>
                            <FormDescription>Your registration address.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>Your email address.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                   <FormField
                        control={form.control}
                        name="vendor"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Vendor role</FormLabel>
                                    <FormDescription>Identify as vendor.</FormDescription>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value} {...field}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="yes" />
                                            <Label htmlFor="yes">Yes</Label>
                                        </div>
                                        {/* <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="no" />
                                            <Label htmlFor="yes">no</Label>
                                        </div> */}
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>        
    </>
  )
}

export default RegistrationForm;