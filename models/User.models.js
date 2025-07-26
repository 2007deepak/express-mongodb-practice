import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
   
    firstName: {
        type: String,
        required: true, 
        trim : true, 
    
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,

    },
    role:{
        type: String,
        enum: ["user", "admin"],
        defult: "user",

    },
    isVerified: {
        type: Boolean,
        defult:false,
    },
    verificationToken: {
        type: String,
    },

    resetPasswordToken : {
        type: String,
    },
    resetPasswordExpire: {
        type: Date
    },
    //ham aise bhi kar sakte hai aur iska alga trika hai jo hame mongoose provided 
    //karata hai vo hai timestapm :  true
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },

},

{
    timestamps: true, // ye hame createdAt aur updatedAt fields automatically add kar deta hai
}

);
// Save hone se pehle pre-hook run hoga,
// this ks referance current document(user)hota hai
//isModified("Password")check karte hai ki password field koi naya value set hua hai ya nhi
//Agar user ka password same hai (update me nahi badla), toh fir se hash nahi karega.
//Performance ke liye important hai, warna har save me password dobara hash ho jayega.
 userSchema.pre("save" ,async function(next){
    if(this.isModified("password")){
        // hashing me conver hoga 10 ye batata hai ki kitani complexity use hogi
        //hashing ke liye
        this.password = await bcrypt.hash(this.password,10)
    
    }
    next();

 });


// ye hame user ka model banane me help karata hai
  const User = mongoose.model("User", userSchema);

export default User;