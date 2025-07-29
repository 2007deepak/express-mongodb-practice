import bcrypt, { compare } from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { hasSubscribers } from "diagnostics_channel";

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

export  const login = async(req,res) => {

    //fetch data 
    const {password,email} = req.body;

    //validation
     if(!password || !email){
        return res.status(400).json({
            success:false,
            message: "All field are required",
        })
     }
    // if user exist
      try {
          const user =  await prisma.user.findUnique({
          where: {email}
        })
        
        if(!user){
          return res.status(400).json({
              success: false,
              message: "User not found",
          });
        }
      // match the password
        const isMatch = await bcrypt.compare(password ,user.password)
        console.log(isMatch);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
       // ab yadi password match kar gya to kya karna hai
       // hame session create karana hai by jwt
        
        const token = jwt.sign({
              id: user._id, role: user.role },
              
             process.env.JWT_SECRET,
               {
                expiresIn : "24h"
              }
            );
            const cookieOption = {
              //ye karne se cokies backend ke haath me chala jataa hai user ke conroll me 9nhi 
              //rahta hai 
              httpOnly : true,
             // secure: true,
             // maxAge: 24*60*60*1000
            }
            res.cookie("token",token, cookieOption)
            
              res.status(200).json({
                success: true,
                token,
                user: {
                  id: user._id,
                  name: user.firstName,
                  role: user.role,
                  phone:user.phone,
                },
                  message: "Login successful",
              });
        
  
      } catch (error) {
        return res.status(400).json({
            success: false,
            message:"Login failed",
        });
        
      }

}