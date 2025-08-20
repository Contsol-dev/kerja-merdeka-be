import express from "express";
import cors from "cors";

import testLunosRouter from "./routes/lunos.route";
import testMailRouter from "./routes/mail.route";
import generateDocRouter from "./routes/generate-doc.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", testLunosRouter);
app.use("/api", testMailRouter);
app.use("/api", generateDocRouter);

export default app;
