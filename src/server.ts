import app from "./app";
import env from "./configs/env.config";

const PORT = env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
