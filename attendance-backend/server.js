const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

// ✅ Allowed Origins
const allowedOrigins = [
  "https://smart-attendance-git-main-sahaj2803s-projects.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001"
];

// ✅ CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
  })
);

// ✅ Handle Preflight Requests
app.options("*", cors());

// ✅ Body Parser
app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));

// ✅ MongoDB Connect
mongoose
  .connect("mongodb+srv://sahaj2803:Sahaj%402803@attendance.5j9ey1h.mongodb.net/?retryWrites=true&w=majority&appName=Attendance")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
