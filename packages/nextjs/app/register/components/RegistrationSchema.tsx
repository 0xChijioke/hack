import { z } from "zod";


export const schema = z.object({
    name: z.string().trim().min(1, {
        message: "Name is required.",
    }),
    email: z.string().trim().email({
        message: "Invalid email address.",
    }),
    address: z.string().trim().optional(),

    vendor: z.string().optional(),
});