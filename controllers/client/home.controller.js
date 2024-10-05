const Product = require("../../models/product.model")
const producthelper = require("../../helpers/product")
// [Get]/
module.exports.index = async (req , res) => {

   //Lay ra sp noi bat
   const productsFeatured = await Product.find({
      featured: "1",
      deleted: false,
      status: "active"
   }).limit(6)
   
   const newProductsFeatured = producthelper.priceNewProducts(productsFeatured)
   //Lay ra sp moi nhat
   const productsNew = await Product.find({
      deleted: false,
      status: "active"
   }).sort({position: "desc"}).limit(6)
   //het
   const newProductsNew = producthelper.priceNewProducts(productsNew)
     
     res.render("client/pages/home/index.pug" , {
        pageTitle:"Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
 }