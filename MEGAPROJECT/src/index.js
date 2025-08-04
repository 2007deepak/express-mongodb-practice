import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/dbconnection.js"

dotenv.config({
    path: "./.env",
})
const PORT = process.env.PORT || 8000;

connectDB()
.then(()=>{
   console.log("MongoDB connected successfully");
   app.listen(PORT, () => {
     console.log(` Server is running on http://localhost:${PORT}`);
   });

})
.catch((error)=> {
    console.error("Mongodb connection error", error);
    process.exit(1)
    
})
