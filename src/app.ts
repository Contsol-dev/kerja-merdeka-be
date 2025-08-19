import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testLunosRouter from "./routes/lunos.route";
import testMailRouter from "./routes/mail.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", testLunosRouter);
app.use("/api", testMailRouter);

export default app;
