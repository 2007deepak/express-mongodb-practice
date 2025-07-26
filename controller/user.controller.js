import User from "../models/User.models.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { log } from "console";


const registerUser = async (req, res) => {

    //fech data
    //validation
    //cheack if user already exists
    //create user in database
    //create varification token
    //save token in database
    //send token as email to user
    //send success response to user


//fetch data from the request body
const{firstName, lastName, email, password} = req.body;
//validation
if(!firstName ||!email || !password || !lastName) {
    return res.status(400).json({
        sucsses: false,
        message : "All field are require"
    });
}
console.log(req.body);

  //check if user already exits
    try{

       const existingUser = await User.findOne({email}) 
       if(existingUser){
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
       }
       // Create a user in database
       const user = await User.create({
        firstName,
        lastName,
        email,
        password,
       })
       console.log("usae is :", user);

       if(!user){
        return res.status(400).json({
            success: false,
            message: "User not created",
        });
       }
       // Create verification token
       
       const token = crypto.randomBytes(32).toString("hex");
       console.log("token is :", token);
       user.verificationToken = token;

       //save token in database
       await user.save();

       //send token to user as email
       const transporter = nodemailer.createTransport({
         host: process.env.MAILTRAP_HOST,
         port: process.env.MAILTRAP_PORT,
         secure: false, // true for 465, false for other ports
         auth: {
           user: process.env.MAILTRAP_USER, // generated ethereal user
           pass: process.env.MAILTRAP_PASS, // generated ethereal password
         },
       });

       const mailOption = {
         from: process.env.MAILTRAP_SENDEREMAIL,
         to: user.email,
         subject: "Verify your email",
         text: `please click on the following link:
         ${process.env.BASE_URL}api/v1/users/verify/${token}`
       };

       await transporter.sendMail(mailOption);
         return res.status(200).json({
          success: true,
          message: "User registered successfully, please check your email for verification",
         });

    }catch(error){
       console.error("Error in registerUser:", error);
        return res.status(400).json({
            sucsses: false,
            error,
            message: "User not registered",
        })
    }

    

   // res.send("registered");
};

const verifyUser = async (req, res) => {
 
  //get token data from url
  const { token } = req.params;
 console.log(token);
  //validate
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is Invalid",
    });
  }
  // find the user with the token

  const user = await User.findOne({
    verificationToken: token,
  });
  // if not found return error
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
  // set isVerified to true
  user.isVerified = true;

  // remove verification token
  //Jab user.verificationToken = null karte ho, field database me rahega but value null hogi.
  //Jab user.verificationToken = undefined karte ho, field hi database se remove ho jata hai.
  //jab hum user.verificationToken = null karte hai to field database me rahega but value null hogi.
  user.verificationToken = undefined;

  // save the usewr in database
  //chuki user database hai onther continent me isiliye await lagana jaruri hai
   await user.save()

   //return response


};

const login = async (req, res) => {
  //fetch data
  const { email, password } = req.body;
  //validation
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  // check if user exits
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //check password or match password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is not match",
      });
    }
    const token = jwt.sign({
      id: user._id, role: user.role },
      "shhhhh", {
        expiresIn : "24h"
      }
    );
    const cookieOption = {
      //ye karne se cokies backend ke haath me chala jataa hai user ke conroll me 9nhi 
      //rahta hai 
      httpOnly : true,
      secure: true,
      maxAge: 24*60*60*1000
    }
    res.cookie("token",token, cookieOption)
    
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.firstName,
          role: user.role,
        },
      });

  } catch (error) {
    console.log("Error is :", error);
    return res.status(400).json({
      success: false,
      message:"User cannot login please register "
    })
  }
};


export { registerUser, verifyUser, login };