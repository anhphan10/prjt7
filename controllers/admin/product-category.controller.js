const ProductCategory = require("../../models/product-category")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
const searchHelper = require("../../helpers/search")
module.exports.index = async (req, res) => {
   let find = {
      deleted: false,
   };
   const objectSearch = searchHelper(req.query);
   if (objectSearch.regex) {
      find.title = objectSearch.regex;
   }
   const records = await ProductCategory.find(find)
   const newRecords = createTreeHelper.tree(records);



   res.render("admin/pages/products-category/index", {
      pageTitle: "Danh Mục Sản Phẩm",
      records: newRecords
   })
}

//[Get]/admin/product-category/creat

module.exports.create = async (req, res) => {
   let find = {
      deleted: false
   }


   const records = await ProductCategory.find(find);
   const newRecords = createTreeHelper.tree(records);

   // console.log(newRecords);

   res.render("admin/pages/products-category/create", {
      pageTitle: " Tạo Danh Mục Sản Phẩm",
      records: newRecords
   })
}

//[POST]/admin/product-category/creat
module.exports.createPost = async (req, res) => {

   const permissions = res.locals.role.permissions;
   if (permissions.includes("product-category_create")) {
      if (req.body.position == "") {
         const count = await ProductCategory.countDocuments();
         req.body.position = count + 1;
      }
      else {
         req.body.position = parseInt(req.body.position)
      }
      const record = new ProductCategory(req.body)
      await record.save();
      res.redirect(`${systemConfig.preFixAdmin}/products-category`)
   }
   else {
      return;
   }


}

module.exports.detail = async (req, res) => {
   //  console.log(req.params.id)
   try {
      const find = {
         deleted: false,
         _id: req.params.id
      }

      const product = await ProductCategory.findOne(find);
      // console.log(product)

      res.render("admin/pages/products-category/detail",
         {
            pageTitle: product.title,
            product: product
         });
   }
   catch (erorr) {
      res.redirect(`${systemConFig.prefixAdmin}/products-category`);
      // res.redirect("back");
   }
}


module.exports.deleteItem = async (req, res) => {
  const permissions = res.locals.role.permissions
  if(permissions.includes("product-category_delete")){
   const id = req.params.id;
   //await Product.deleteOne({_id:id});

   try {
      await ProductCategory.updateOne({ _id: id }, {
         deleted: true,
         deletedAt: new Date()
      })
      req.flash("success", "Xóa Thành Công 1 Sản Phẩm");
   }
   catch (error) {
      req.flash("error", "Xoa That Bai")
   }


   res.redirect("back")
  }
  else{
   return;
  }
}

module.exports.edit = async (req, res) => {
   // console.log(req.params.id)
   try {
      const find = {
         deleted: false,
         _id: req.params.id
      }

      const product = await ProductCategory.findOne(find);
      // console.log(product)



      const records = await ProductCategory.find({
         deleted: false,

      });
      const newRecords = createTreeHelper.tree(records);


      res.render("admin/pages/products-category/edit",
         {
            pageTitle: "Chỉnh Sửa Danh Mục Sản Phẩm ",
            product: product,
            records: newRecords
         });
   }
   catch (erorr) {
      res.redirect(`${systemConFig.preFixAdmin}/products-category`);
   }

}

module.exports.editPatch = async (req, res) => {
   // console.log(req.body)

   req.body.position = parseInt(req.body.position);

   if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename} `;
   }

   try {
      await ProductCategory.updateOne({
         _id: req.params.id
      }, req.body);
      req.flash("success", "Cập nhật thành công")
   } catch (erorr) {
      req.flash("error", " Cập nhật thất bại")
   }
   res.redirect("back")
   // res.send("OK")
};


//[Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
   const status = req.params.status;
   const id = req.params.id;
   try {
      await ProductCategory.updateOne({ _id: id }, { status: status });
      req.flash("success", "Cập nhật trạng thái sản phẩm thành công");
   }
   catch (erorr) {
      req.flash("error", "Cập nhật trạng thái sản phẩm thất bại")
   }

   res.redirect("back");


}