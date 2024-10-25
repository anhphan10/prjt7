const express = require("express");
const router = express.Router();
const multer = require("multer");
const validateResetPassword = require("../../validates/admin/my-account.validate")

const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares")

const controller = require("../../controllers/admin/my-account.controller");

router.get("/" , controller.index);
router.get("/edit" , controller.edit);
router.patch(
    "/edit" , 
    upload.single("avatar"),
    uploadCloud.upload,
    controller.editPatch
);
router.get("/password/reset",controller.resetPassword);
router.post("/password/reset",validateResetPassword.resetPasswordPost,controller.resetPasswordPost);

module.exports = router;