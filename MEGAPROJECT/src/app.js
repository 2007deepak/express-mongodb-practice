import express from "express";
const app = express();

//router import
import  healthCheckRouter from "./routes/healthcheck.routes.js"

app.use("/api/v1/healthCheckRouter", healthCheckRouter)

export default app;
