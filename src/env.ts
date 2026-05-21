import z from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    APP: z.enum(["development", "production"]).default("development")
})

export const env = envSchema.parse(process.env)