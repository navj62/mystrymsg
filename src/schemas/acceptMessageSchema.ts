import { z } from "zod";

export const AcceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});

export type AcceptMessageForm = z.infer<typeof AcceptMessageSchema>;
