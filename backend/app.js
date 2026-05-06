import express from "express";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();

app.use(express.json());


// routes
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/files", fileRoutes);


export default app;