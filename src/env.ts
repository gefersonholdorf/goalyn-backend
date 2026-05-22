import z from "zod";
import "dotenv/config";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    APP: z.enum(["development", "production"]).default("development"),
    DATABASE_URL: z.string()
})

export const env = envSchema.parse(process.env)