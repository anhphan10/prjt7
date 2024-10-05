const systemConfix = require("../../config/system")
const Account = require("../../models/account.model")
const Role = require("../../models/roles.model")
module.exports.requireAuth = async (req, res, next) => {

    if (!req.cookies.token) {
        res.redirect(`${systemConfix.preFixAdmin}/auth/login`)
    }
    else {
        const user = await Account.findOne({
            token: req.cookies.token
        })
        if (!user) {
            res.redirect(`${systemConfix.preFixAdmin}/auth/login`)
        }
        else {
            const role = await Role.findOne({
              _id: user.role_id
            }).select("title permissions");

            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }

}