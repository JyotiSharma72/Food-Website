import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
// ✅ Define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve static files from the "uploads" folder
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

// Database connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`🚀 Server Started on http://localhost:${port}`);
});
