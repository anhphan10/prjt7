const md5 = require("md5")
const bcrypt = require("bcrypt");
const User = require("../../models/user.model")
const generateHelper = require("../../helpers/generate")
const ForgotPassword = require("../../models/forgot-password.model")
const sendMailHelper = require("../../helpers/sendMail")
//[Get]user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng Kí Tài Khoản"
    });
}
//[Post]user/register
module.exports.registerPost = async (req, res) => {
    const saltRounds = 10;
    const didEmailExist = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (didEmailExist) {
        req.flash("error", "Email Đã Tồn Tại!");
        res.redirect("back");
        return;
    }
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    

    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}
//[Get]/user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Trang Đăng Nhập"
    })
}
//[Post]/user/loginPost
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Không Tìm Thấy Email!");
        res.redirect("back");
        return;
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
        req.flash("error", "Không Tìm Thấy Mật Khẩu!");
        res.redirect("back");
        return;
    }
    if (user.status == "inactive") {
        req.flash("error", "Tài Khoản Đang Bị Khóa");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser)
    //Lưu userid vào collection cart
    await Cart.updateOne(
        {
            _id: req.cookies.cartId
        },
        {
            user_id: user.id
        }
    )
    //end
    res.redirect("/");
}
//[Get]/user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}
//[Get]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy Lại Mật Khẩu"
    })
}
//[Post]/user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne(
        {
            email: email,
            deleted: false
        }
    )
    if (!user) {
        req.flash("error", "Không Tìm Thấy Email");
        res.redirect("back");
        return;
    }
    //Tạo OTP lưu Vào Collection
    const otp = generateHelper.getSecureRandomNumbers()
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    //Gửi OTP Qua Email Của Người Dùng
    const subject = `Mã OTP xác minh lấy lại mật khẩu`;
    const html = `
        Mã OTP Xác Minh Lấy Lại Mật Khẩu Là <b>${otp}</b>.Lưu Ý Không Được Để Lộ Mã OTP
    `;
    sendMailHelper.sendMail(email,subject,html);
    //end
    res.redirect(`/user/password/otp?email=${email}`)
}
//[Get]/user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập Mã OTP",
        email: email
    })
}
//[Post]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!result) {
        req.flash("error", "OTP Không Hợp Lệ");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}
//[Get]/user/password/reset
module.exports.resetPassword = async (req, res) => {
    const user = res.locals.user;
    if(!user)
        {
        req.flash("error" ,"Vui Lòng Đăng Nhập");
        res.redirect("/");
        return;    
        }
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi Mật Khẩu"
    })
}
//[Post]/user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const tokenUser = req.cookies.tokenUser;
    const user = res.locals.user;
    if(!user){
        req.flash("error" ,"Lỗi!");
        res.redirect("/");
        return;    
    }
        await User.updateOne(
            {
                tokenUser: tokenUser
            },
            {
                password: req.body.password
            }
        )
        res.redirect("/");
}
//[get]/user/info
module.exports.info = async(req,res)=>{
    res.render("client/pages/user/info",{
        pageTitle:"Thông Tin Tài Khoản"
    })
}


