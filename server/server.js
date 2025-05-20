import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDb.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Route imports
import userRoutes from "./routes/userRoutes.js";
import landRoutes from "./routes/landscanRoutes.js";
import suggestionsRoutes from "./routes/cropSuggestionsRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

// Load environment variables
dotenv.config();

// Connect to database
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1);
  }
})();

const app = express();

// ✅ CORS Configuration - MUST BE FIRST
const corsOptions = {
  origin: [
    "https://crop-rec-app-kappa.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

// ✅ Core Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ✅ Sanity Check Routes
app.get("/", (req, res) => {
  res.status(200).send("🎉 Server is live and kicking!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is running." });
});

app.get("/cors-check", (req, res) => {
  res.status(200).json({ message: "CORS is working fine!" });
});

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/land", landRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/weather", weatherRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❗ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong." });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("✅ Server started successfully and ready to accept requests!");
});
