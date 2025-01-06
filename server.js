import express from "express";
import userRouter from "./routes/userRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import { ConnectDB } from "./config/db.js";
import "dotenv/config.js";

const app = express();
app.use(express.json());

ConnectDB();

app.use("/api/user", userRouter);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
