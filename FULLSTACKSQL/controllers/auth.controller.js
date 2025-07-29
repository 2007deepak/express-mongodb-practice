import bcrypt from "bcryptjs"
import crypto from "crypto"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async (req , res) => {

    // fetch data 
    const {email,name,password,phone} = req.body;

    //validation
    if(!name || !email || !password, !phone){
        return res.status(400).json({
            success: false,
            message: "All field are required"
        })
    }
    //check user exist
    
   try {
     const existingUser = await prisma.user.findUnique({
         where: {email}
     })
    // if user exist return response
     
    if(existingUser){
     return res.status(400).json({
         success: true,
         message: "User allready exist"
 
     })
    }

    // hash the pass
        const hashedPassword = await bcrypt.hash(password,10)
        const  verificationToken  = crypto.randomBytes(32).toString("hex") ;
    // create user
           const user = await prisma.user.create({
            data:{
                name,
                email,
                phone,
                password: hashedPassword,
                verificationToken
            }
        })    

       // send mail TODO

   } catch (error) {
        console.log("Error is :", error);
        
      return res.status(400).json({
        success: false,
        message: "Registration failed ",
      });
    
   }


};

