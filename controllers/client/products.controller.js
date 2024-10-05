const Product = require("../../models/product.model");
const producthelper = require("../../helpers/product");
const productCategory = require("../../models/product-category");
const productCategoryHelper = require("../../helpers/product-category");
module.exports.index = async (req, res) => {


  const products = await Product.find({
    status: "active",
    deleted: false
  });

  const newProducts = producthelper.priceNewProducts(products)

  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: newProducts
  });
}

//[Get]/products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active"
    };

    const product = await Product.findOne(find)
    if(product.product_category_id){
      const category = await productCategory.findOne({
        _id :  product.product_category_id,
        status: "active",
        deleted: false
      })
      product.category = category
    }
    
    product.priceNew = producthelper.priceNewProduct(product)
    


    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product

    });
  }
  catch (error) {
    res.redirect(`/products`);
  }
}

//[get]/products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await productCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false
  })

 

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);



  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = producthelper.priceNewProducts(products)

  // 66f697a18cbcbbc15032c0a2
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts
  })

}