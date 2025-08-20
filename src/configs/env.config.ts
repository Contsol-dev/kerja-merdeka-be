import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  LUNOS_API_KEY: process.env.LUNOS_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  MAILRY: {
    API_KEY: process.env.MAILRY_API_KEY,
    EMAIL_ID: process.env.MAILRY_EMAIL_ID,
  },
};

export default env;
