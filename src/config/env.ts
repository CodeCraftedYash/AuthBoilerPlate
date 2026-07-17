import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(["development","production","test"]),
    CLIENT_URL: z.string(),
    LOG_LEVEL: z.enum([
        "fatal",
        "error",
        "warn",
        "info",
        "debug",
        "trace"
]),
DATABASE_URL:z.string().min(1, "DATABASE_URL cannot be empty")
})

export const env = envSchema.parse(process.env);
