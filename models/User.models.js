import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   
    FirstName: {
        type: String,
        required: true, 
        trim : true, 
    
    },
    Lastname:{
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

)
// ye hame user ka model banane me help karata hai
  const User = mongoose.model("User", userSchema);

export default User;