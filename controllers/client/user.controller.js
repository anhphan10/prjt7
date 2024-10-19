const md5 = require("md5")
const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendmail")
//[Get]user/register
module.exports.register = async(req,res)=>{
    res.render("client/pages/user/register",{
        pageTitle:"Đăng Kí Tài Khoản"
    });
}
//[Post]user/register
module.exports.registerPost = async (req,res)=>{
    const exisEmail = await User.findOne({
        email:req.body.email,
        deleted: false
    });
    if(exisEmail){
        req.flash("error" , "Email Đã Tồn Tại!");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password)

    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser" , user.tokenUser);
    res.redirect("/");
}

//[Get]user/login
module.exports.login = async (req,res) => {
    res.render("client/pages/user/login",{
        pageTitle:"Đăng Nhập Tài Khoản"
    })
}
//[post]user/login
module.exports.loginPost = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted:false
    });
    if(!user){
        req.flash("error" ,"Email Không Tồn Tại!");
        res.redirect("back");
        return;
    }
    if(md5(password)!=user.password){
        req.flash("error" ," Sai Mật Khẩu!");
        res.redirect("back");
        return;
    }
    if(user.status=="inactive"){
        req.flash("error" ,"Tài Khoản Đang Bị Khóa");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/");


}
//[get]user/logout
module.exports.logout = async (req,res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
}
//[get]/user/password/forgot
module.exports.forgotPassword = async (req,res) => {
    res.render("client/pages/user/forgot-password",{
        pageTitle:"Lấy Lại Mật Khẩu"
    })
}
//[post]/user/password/forgot
module.exports.forgotPasswordPost = async(req, res)=>{
 const email = req.body.email;
 const user = await User.findOne({
    email: email,
    deleted:false
 })
 if(!user){
    req.flash("error", "Email Không Tồn Tại")
    res.redirect("back");
    return;
 }
 //Tạo Mã OTP Và Lưu Thông Tin Vào Collection
 const otp = generateHelper.generateRandomNumber(8);
 const objectForgotPassword = {
    email:email,
    otp:otp,
    expireAt: Date.now()
 };
const forgotPassword = new ForgotPassword(objectForgotPassword);
await forgotPassword.save(); 

 //Gửi Mã OTP qua email cho người dùng
 const subject = "Mã OTP Để Xác Minh Lấy Lại Mật Khẩu";
 const html=`Mã OTP Lấy Lại Mật Khẩu Là <b>${otp}</b>.Thời Gian Sử Dụng Là 5 Phút.Lưu ý Không Được Để Lộ Mã OTP`;
 sendMailHelper.sendmail(email,subject,html);
 res.redirect(`/user/password/otp?email=${email}`)
}
//[Get]user/password/otp
module.exports.otpPassword = async (req, res)=>{
    const email = req.query.email;
    res.render("client/pages/user/otp-password",{
        pageTitle:"Nhập Mã OTP",
        email:email
    })
}
//[Post]/user/password/otp
module.exports.otpPasswordPost = async (req, res)=>{
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email:email,
    otp:otp
  });
//   console.log(result);
  if(!result){
    req.flash("error","otp không hợp lệ");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email
  })
  res.cookie("tokenUser",user.tokenUser);
  res.redirect("/user/password/reset");
}

//[Get]user/password/reset
module.exports.resetPassword = async (req, res)=>{
    res.render("client/pages/user/reset-password",{
        pageTitle:"Đổi Mật Khẩu"
    })
}

//[Post]user/password/reset
module.exports.resetPasswordPost = async (req, res)=>{
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser:tokenUser
    },{
        password : md5(password)
    })
    res.redirect("/");
}
