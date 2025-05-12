const systemConfig = require("../../config/system");
const md5 = require("md5");
const Account = require("../../models/account.model");
const bcrypt = require("bcrypt")
module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.preFixAdmin}/dashboard`)
    }
    else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Trang Đăng Nhập"
        })
    }
}
//[post] admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const user = await Account.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        req.flash("error", "email không tồn tại");
        res.redirect("back");
        return;
    }

    if (md5(password) != user.password) {
        req.flash("error", "Không Tìm Thấy Mật Khẩu");
        res.redirect("back");
        return;
    }

    if (user.status == "inactive") {
        req.flash("error", "Tài Khoản Đã Bị Khóa")
        res.redirect("back");
        return
    }
    res.cookie("token", user.token);
    res.redirect(`${systemConfig.preFixAdmin}/dashboard`)


}
//[get] admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.preFixAdmin}/auth/login`)
}