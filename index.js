import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./utils/dbconnection.js";
import  cookieParser from "cookie-parser";
// import all routes
import userRoutes from "./routes/user.routes.js";

// import { registerUser } from "./controller/user.controller.js";

dotenv.config();
const app = express();

// cors ka ye part sabhi ko headec deta hai ye bahut jaruri hai pdana ye har jagah
// same rahega sabhi jagah par 
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// because we are accecpt the json matalab hame {name : 'Deepak'} ko lena tab ham json ko lete hai
app.use(express.json());

// ye space ko handdle karane ke liye  hota hai jaise koi website hai localhost://0.0.0.1//Deepak%20Kumar
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Cohort!");
});

app.get("/deepak", (req, res) => {
  res.send("Deepak");
});

// Connect to db

dbConnection();

//user routes

app.use("/api/v1/users/", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
