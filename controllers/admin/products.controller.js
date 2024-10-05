const Product = require("../../models/product.model")

const filterStatusHelper = require("../../helpers/fillter-status")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const systemConFig = require("../../config/system")
const ProductCategory = require("../../models/product-category")
const createTreeHelper = require("../../helpers/createTree")
const Account = require("../../models/account.model")

// [Get]/admin/products
module.exports.index = async (req, res) => {

   const filterStatus = filterStatusHelper(req.query);


   let find = {
      deleted: false,
   };

   if (req.query.status) {
      find.status = req.query.status;
   }

   const objectSearch = searchHelper(req.query);

   if (objectSearch.regex) {
      find.title = objectSearch.regex;
   }

   //pagination
   const countProducts = await Product.countDocuments(find);
   let objectPagination = paginationHelper(
      {
         currentPage: 1,
         limitItems: 4
      },
      req.query,
      countProducts
   );
   //end pagination

   //Sort
   let sort = {}

   if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue
   }
   else {
      sort.position = "desc";
   }
   //End Sort


   const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

   for (const product of products) {
      const user = await Account.findOne({
         //lay ra thong tin nguoi tao
         _id: product.createdBy.account_id
      });

      // console.log(user);
      if (user) {
         product.accountFullName = user.fullName;

      }

      //lay ra thong tin nguoi cap nhat

      const updatedBy = product.updatedBy.slice(-1)[0];
      if (updatedBy) {
         const userUpdated = await Account.findOne({
            _id: updatedBy.account_id
         })

         updatedBy.accountFullName = userUpdated.fullName
      }


   }
   // console.log(products);
   res.render("admin/pages/products/index", {
      pageTitle: "Danh Sách Sản Phẩm",
      products: products,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination
   })
};

//[Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
   const permissions = res.locals.role.permissions
   if (permissions.includes("product_edit")) {
      const status = req.params.status;
      const id = req.params.id;
      try {
         const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
         }
         await Product.updateOne({ _id: id }, {
            status: status,
            $push: { updatedBy: updatedBy }
         });
         req.flash("success", "Cập nhật trạng thái sản phẩm thành công");
      }
      catch (erorr) {
         req.flash("error", "Cập nhật trạng thái sản phẩm thất bại")
      }

      res.redirect("back");
   }
   else {
      res.send("403")
   }



}


//[patch]/admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
   const type = req.body.type;
   const ids = req.body.ids.split(", ");
   const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
   }

   switch (type) {
      case "active":
         await Product.updateMany({ _id: { $in: ids } }, {
            status: "active",
            $push: { updatedBy: updatedBy }
         });
         req.flash("success", `Cập nhật trạng thái sản phẩm thành công ${ids.length} sản phẩm`);
         break;
      case "inactive":
         await Product.updateMany({ _id: { $in: ids } }, {
            status: "inactive",
            $push: { updatedBy: updatedBy }
         })
         req.flash("success", `Cập nhật trạng thái sản phẩm thành công ${ids.length} sản phẩm`);
         break;
      case "delete-all":
         await Product.updateMany({ _id: { $in: ids } }, {
            deleted: true,
            deletedAt: new Date(),
         });
         req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
         break;
      case "change-position":
         for (const item of ids) {
            let [id, position] = item.split("-");
            position = parseInt(position);
            await Product.updateOne({ _id: id }, {
               position: position,
               $push: { updatedBy: updatedBy }
            })
         }
      default:
         break;
   }

   res.redirect("back")
}
//[Delete]/admin/products/delete/id
module.exports.deleteItem = async (req, res) => {
   const id = req.params.id;
   //await Product.deleteOne({_id:id});

   try {
      await Product.updateOne({ _id: id }, {
         deleted: true,
         deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
         }
      })
      req.flash("success", "Xóa Thành Công 1 Sản Phẩm");
   }
   catch (error) {
      req.flash("error", "Xoa That Bai")
   }


   res.redirect("back")


}
//[Get]/admin/products/create
module.exports.create = async (req, res) => {
   // console.log(res.locals.user);
   let find = {
      deleted: false
   };

   const category = await ProductCategory.find(find);
   const newCategory = createTreeHelper.tree(category)


   res.render("admin/pages/products/create", {
      pageTitle: "Thêm Mới Sản Phẩm",
      category: newCategory
   });
}

module.exports.createPost = async (req, res) => {

   const permissions = res.locals.role.permissions;

   if (permissions.includes("product_create")) {
      req.body.price = parseInt(req.body.price)
      req.body.discountPercentage = parseInt(req.body.discountPercentage)
      req.body.stock = parseInt(req.body.stock)

      if (req.body.position == "") {
         const countProducts = await Product.countDocuments();
         req.body.position = countProducts + 1;
      }
      else {
         req.body.position = parseInt(req.body.position);
      }

      req.body.createdBy = {
         account_id: res.locals.user.id
      }

      try {
         const product = new Product(req.body)
         await product.save();
         req.flash("success", "Thêm Thành Công!")
      } catch {
         req.flash("error", "Thêm Thất Bại!")
      }
      res.redirect(`${systemConFig.preFixAdmin}/products`)
   }
   else {
      res.send("433");
   }
}

// [Get]/admin/products/edit/:id
module.exports.edit = async (req, res) => {


   try {
      const find = {
         deleted: false,
         _id: req.params.id
      }

      const product = await Product.findOne(find);
      // console.log(product)
      const category = await ProductCategory.find({
         deleted: false
      })

      const newCategory = createTreeHelper.tree(category);

      res.render("admin/pages/products/edit",
         {
            pageTitle: "Chỉnh Sửa Sản Phẩm ",
            product: product,
            category: newCategory
         });
   }
   catch (erorr) {
      res.redirect(`${systemConFig.preFixAdmin}/products`);
   }
}





//[Patch]/admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
   const permissions = res.locals.role.permissions
   if (permissions.includes("product_edit")) {
      const id = req.params.id;
      // console.log(req.body)
      req.body.price = parseInt(req.body.price)
      req.body.discountPercentage = parseInt(req.body.discountPercentage)
      req.body.stock = parseInt(req.body.stock)
      req.body.position = parseInt(req.body.position);

      if (req.file) {
         req.body.thumbnail = `/uploads/${req.file.filename} `;
      }

      try {

         const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
         }


         await Product.updateOne({
            _id: id
         }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
         });
         req.flash("success", "Cập nhật thành công")
      } catch (erorr) {
         req.flash("error", " Cập nhật thất bại")
      }
      res.redirect("back")
   }
   else {
      res.send("403")
   }

   // res.send("OK")
};

//[Get]/admin/products/detail/id
module.exports.detail = async (req, res) => {
   // console.log(req.params.id)
   try {
      const find = {
         deleted: false,
         _id: req.params.id
      }

      const product = await Product.findOne(find);
      // console.log(product)

      res.render("admin/pages/products/detail",
         {
            pageTitle: product.title,
            product: product
         });
   }
   catch (erorr) {
      res.redirect(`${systemConFig.preFixAdmin}/products`);
   }

}




