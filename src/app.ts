import express from "express";
import cors from "cors";

import appRouter from "./routes/app.route";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", appRouter);
app.use(errorHandlerMiddleware);

export default app;
