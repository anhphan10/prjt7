const Account = require("../../models/account.model");
const md5 = require("md5");
const bcrypt = require("bcrypt")
const systemConfig = require("../../config/system")

//[Get] admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông Tin Cá Nhân",
    });
}

//[Get] admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh Sửa Thông Tin Cá Nhân"
    });
}

module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id
    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash("error", `email ${req.body.email} đã tồn tại`)
    }
    else {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        }
        else {
            delete req.body.password
        }

        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập Nhật Tài Khoản Thành Công")

    }
    res.redirect("back");
};
//[Get]admin/my-account/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("admin/pages/my-account/resetpassword", {
        pageTitle: "Đổi Mật Khẩu"
    })
}
//[Post]admin/my-account/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const saltRound = 10;
    req.body.password = await bcrypt.hash(req.body.password, saltRound);
    const user = await Account.findOne(
        {
        token: req.cookies.token,
        },
        {
        password: req.body.password
        }

    )
    if (!user) {
        req.flash("error", "Mật Khẩu Cũ Không Chính Xác");
        res.redirect("back");
        return;
    }
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, saltRound);
    await Account.updateOne(
        {
            token: req.cookies.token
        },
        {
            password: req.body.newPassword
        }
    )
    req.flash("success", "Đổi Mật Khẩu Thành Công");
    res.redirect(`${systemConfig.preFixAdmin}/dashboard`);
}

