import User from "../models/User.models.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
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


export { registerUser, verifyUser };