const md5 = require("md5")
const bcrypt = require("bcrypt");
const User = require("../../models/user.model")
const saltRounds = 10;
//[Get]user/register
module.exports.register = async(req,res)=>{
    res.render("client/pages/user/register",{
        pageTitle:"Đăng Kí Tài Khoản"
    });
}
//[Post]user/register
module.exports.registerPost = async (req,res)=>{
    const didEmailExist = await User.findOne({
        email:req.body.email,
        deleted: false
    });
    if(didEmailExist){
        req.flash("error" , "Email Đã Tồn Tại!");
        res.redirect("back");
        return;
    }
    req.body.password = await bcrypt.hash(req.body.password , saltRounds);
    console.log(req.body.password);
  
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser" , user.tokenUser);
    res.redirect("/");
}
//[Get]/user/login
module.exports.login = async(req, res)=>{
    res.render("client/pages/user/login",{
        pageTitle: "Trang Đăng Nhập"
    })
}
//[Post]/user/loginPost
module.exports.loginPost = async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted:false
    });
    const userPassword = user.password;
    if(!user){
        req.flash("error" ,"Email Không Tồn Tại!");
        res.redirect("back");
        return;
    }
    const check = await bcrypt.compare(password,userPassword);
    if(!check){
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
