const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();
const controller = require("../../controllers/admin/product-category.controller");
const validates = require("../../validates/admin/product-category.validates")

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validates.createPost,
    controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteItem);
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validates.createPost,
    controller.editPatch
);



module.exports = router;