const mongoose = require("mongoose");
const forgotPasswordSchema = new mongoose.Schema(
    {
     email:String,
     otp:String,
     expireAt:{
        type: Date,
        expires: 500
     }
    },
    {
     timestamps: true
    });
const ForgotPassword = mongoose.model("ForgotPassword" , forgotPasswordSchema , "forgot-password");
module.exports = ForgotPassword;