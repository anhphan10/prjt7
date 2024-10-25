module.exports.resetPasswordPost = (req,res,next)=>{
    if(!req.body.password){
        req.flash("error" , "Vui lòng nhập mật khẩu mới")
        res.redirect("back")
        return
    }

    if(!req.body.confirmPassword){
        req.flash("error" , "Vui lòng nhập mật khẩu xác nhận")
        res.redirect("back")
        return
    }
    if(req.body.password != req.body.confirmPassword){
        req.flash("error" , "Xác nhận mật khẩu không trùng khớp")
        res.redirect("back")
        return
    }
    next();
}