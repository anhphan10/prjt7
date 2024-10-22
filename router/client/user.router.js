const userValidate = require("../../validates/client/user.validate")
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);
<<<<<<< HEAD
router.get("/login" , controller.login)
router.post("/login" ,userValidate.loginPost ,controller.loginPost)
router.get("/logout" ,controller.logout)
router.get("/password/forgot", controller.forgotPassword)
router.post("/password/forgot", userValidate.forgotPassWordPost ,controller.forgotPasswordPost)
router.get("/password/otp" , controller.otpPassword)
router.post("/password/otp" , controller.otpPasswordPost)
router.get("/password/reset",controller.resetPassword)
router.post("/password/reset",userValidate.resetPasswordPost,controller.resetPasswordPost)
module.exports = router;
=======

module.exports = router;
>>>>>>> main
