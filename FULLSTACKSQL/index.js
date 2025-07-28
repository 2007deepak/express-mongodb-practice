import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config()

const port = process.env.PORT || 4000
const app = express();


app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173'
}));

// ye hai json se data lene ke liye
app.use(express.json())
// ye hai  URL Se data lene ke liye 
app.use(express.urlencoded({extended:true}))

app.get("/", (req,res) => {

    res.status(200).json({
        success: true,
        message: "test checked"
    })
})


app.listen(process.env.PORT, () => {
    console.log(`Backend is runing at Port:${port}`);
    
})