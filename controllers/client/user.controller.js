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