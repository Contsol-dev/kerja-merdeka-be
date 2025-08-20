import express from "express";
import cors from "cors";

import appRouter from "./routes/app.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", appRouter);

export default app;
