
import { z } from "zod";

export const formSchema = z.object({
  serviceCategory: z.string().min(1, { message: "Please select a service category" }),
  serviceType: z.string().min(1, { message: "Please select a specific service" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: "Please select a time slot" }),
  address: z.string().min(5, { message: "Please provide your address" }),
  name: z.string().min(2, { message: "Please provide your name" }),
  phone: z.string().min(10, { message: "Please provide a valid phone number" }),
  urgent: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;
