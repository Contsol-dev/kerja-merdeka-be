import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  LUNOS_API_KEY: process.env.LUNOS_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  MAILRY: {
    API_KEY: process.env.MAILRY_API_KEY,
    API_URL: "https://api.mailry.co/ext",
    EMAIL_ID: process.env.MAILRY_EMAIL_ID,
  },
  UNLI: {
    API_KEY: process.env.UNLI_API_KEY,
    API_URL: "https://api.unli.dev/v1",
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || "",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },
};

export default env;
