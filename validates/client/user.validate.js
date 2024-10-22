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
<<<<<<< HEAD
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

module.exports.resetPasswordPost = (req,res,next)=>{
   if(!req.body.password){
    req.flash("error", `Mật Khẩu Không Được Để Trống`);
    res.redirect("back");
    return;
   }

   if(!req.body.confirmPassword){
    req.flash("error",`Vui Lòng Xác Nhận Lại Mật Khẩu`);
    res.redirect("back");
    return;
   }
   if(req.body.password!=req.body.confirmPassword){
    req.flash("error",`Xác Nhận Mật Khẩu Không Trùng Khớp`);
    res.redirect("back");
    return;
   }

    next()
}

=======
}
>>>>>>> main
