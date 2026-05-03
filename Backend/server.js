const express = require("express");
const cors = require("cors");

// ✅ Load env
require("dotenv").config({ path: __dirname + "/.env" });

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes"); // (if you created tasks)

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);   
app.use("/api/tasks", taskRoutes);         

app.get("/", (req, res) => {
  res.send("API is running...");
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});