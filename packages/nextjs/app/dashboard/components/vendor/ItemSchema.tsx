import { z } from "zod";


// schema for the form data
export const itemSchema = z.object({
    name: z.string().trim().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().trim().min(2, {
        message: "You have to add a description."
    }),
    price: z
        .coerce
        .number()
        .positive(),
    quantity: z
        .coerce
        .number()
        .min(1),
    // imageSrc: z.string().regex(/^https:\/\/\/ipfs\/.*/, {
    //     message: "Invalid image source format."
    // })
});
  