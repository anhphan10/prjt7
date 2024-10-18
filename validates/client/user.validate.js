module.exports.registerPost = (req , res , next) => {
    if(!req.body.fullName){
        req.flash("error" , "Không Được Để Trống Họ Và Tên!");
        res.redirect("back");
        return;   
    }
    if(!req.body.email){
        req.flash("error" , "Không Được Để Trống Email!");
        res.redirect("back");
        return;   
    }
    if(!req.body.password){
        req.flash("error" , "Không Được Đẻ Trống Mật Khẩu!");
        res.redirect("back");
        return;   
    }
    next();
}

module.exports.loginPost = (req , res , next) => {
    if(!req.body.email){
        req.flash("error" , "Không Được Để Trống Email!");
        res.redirect("back");
        return;   
    }
    if(!req.body.password){
        req.flash("error" , "Không Được Đẻ Trống Mật Khẩu!");
        res.redirect("back");
        return;   
    }
    next();
}

module.exports.forgotPassWordPost = (req,res,next)=>{
    if(!req.body.email){
        req.flash("error" , "Không Được Để Trống Email!");
        res.redirect("back");
        return;   
    }
    next()
}

