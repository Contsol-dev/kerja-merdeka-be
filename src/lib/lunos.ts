import { LunosClient } from "@lunos/client";
import env from "../configs/env.config";

const lunos = new LunosClient({ apiKey: env.LUNOS_API_KEY });

export default lunos;
