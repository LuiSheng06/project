import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employee.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.listen(5001, () => console.log("🚀 Server running on port 5000"));

