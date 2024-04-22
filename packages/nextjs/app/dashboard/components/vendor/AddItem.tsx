'use client'

import { useFormState } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~~/app/components/ui/Form";
import { Button } from "~~/app/components/ui/Button";
import { Input } from "~~/app/components/ui/Input";
import { itemSchema } from "./ItemSchema";
import ConfirmationDialog from "~~/app/components/ConfirmationDialog.";
import { useRef, useState } from "react";
import { imageUpload } from "~~/utils/imageUpload";
import Image from "next/image";



export const AddItem = ({ 
  onFormAction,
}: {
  onFormAction: (
    prevState: {
      message: string;
      item?: z.infer<typeof itemSchema>;
      issues?: string[];
    },
    data: FormData,
  ) => Promise<{
    message: string;
    item?: z.infer<typeof itemSchema>;
    issues?: string[];
  }>;
}) => {

  const [state, formAction] = useFormState(onFormAction, {
    message: "",
  });

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for dialog content
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [imageSrc, setImageSrc] = useState('');



  const handleConfirm = () => {
    setIsDialogOpen(false);
    return true; // Return true to proceed with the upload
  };
  
  const handleCancel = () => {
    setIsDialogOpen(false);
    return false; // Return false to cancel the upload
  };
  
  // Function to open the dialog with provided title and description
  const openDialog = (title: string, description: string) => {
    setDialogTitle(title);
    setDialogDescription(description);
    // setIsDialogOpen(true);
    
    return new Promise<boolean>((resolve) => {
      // Resolves with true on confirm, false on cancel
      // Directly call handleConfirm and handleCancel functions
      const confirmed = window.confirm(description); // You can replace this with your confirmation dialog logic
      resolve(confirmed);
    });
  };
  
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
        const file = event.target.files?.[0];
        if (!file) {
            throw new Error("No file selected.");
      }
      
      const confirmed = await openDialog(
        "Confirm Image Upload",
        "Are you sure you want to upload this image?"
      );
  
      if (confirmed) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const formData = new FormData();
            formData.append("file", file);
  
            const ipfsHash = await imageUpload(formData);
  
            console.log("Image uploaded to IPFS:", ipfsHash);
            setImageSrc(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        };
        reader.onerror = () => {
          throw new Error("Error reading file.");
        };
        reader.readAsArrayBuffer(file);
        } else {
            console.log("Upload cancelled by user.");
      }
    } catch (error) {
        console.error("Error handling file change:", error);
        // Handle error and provide feedback to the user
    }
};



  const formRef = useRef<HTMLFormElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);


  return (
    <>
      <div className="w-full p-2 bg-slate-100 shadow-center rounded-lg lg:max-w-[500px]">
        <h5 className="text-center tracking-wide uppercase py-2 text-sm">Add Product</h5>
        <Form {...form}>
          <div>{state?.message}</div>
          <form 
            ref={formRef}
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(() => {
                const formData = new FormData(formRef.current!);
                if (imageSrc) {
                  formData.append("imageSrc", imageSrc);
                }
              formAction(formData);
              })(evt);
            }}
            className="space-y-8">
            {/* Input for uploading an image */}
            <div className="grid w-full items-center gap-1.5">
              <FormLabel htmlFor="picture">Image</FormLabel>
              <Input
                id="picture"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange} />
              {/* Display the uploaded image if available */}
              <div className="flex justify-center">
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    className="rounded-lg object-contain"
                    width={200}
                    height={200}
                    alt="Uploaded Image"
                  />
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.description?.message}</FormMessage>
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
                    <Input placeholder="Enter price" type="number" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.price?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quantity" type="number" {...field} />
                  </FormControl>
                  <FormMessage>{form.formState.errors.quantity?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button className="flex justify-center" type="submit">Submit</Button>
          </form>
        </Form>
        
        <ConfirmationDialog
          isOpen={isDialogOpen}
          title={dialogTitle}
          description={dialogDescription}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
}
