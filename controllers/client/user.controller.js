const md5 = require("md5")
const User = require("../../models/user.model")
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
