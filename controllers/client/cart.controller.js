
const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")

//[get]/cart/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    })
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const product_id = item.product_id;

            const productInfo = await Product.findOne({
                _id: product_id
            });
            productInfo.priceNew = productHelper.priceNewProduct(productInfo);

            item.productInfo = productInfo;
            item.totalPrice = item.quantity * productInfo.priceNew;

        }
    }
    cart.totalPrice = cart.products.reduce((sum, item)=> sum + item.totalPrice,0)

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ Hàng",
        cartDetail: cart
    });
}

//[post]/cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    const quantity = parseInt(req.body.quantity);

    console.log(cartId);


    const cart = await Cart.findOne({
        _id: cartId
    });
    console.log(cart);


    const existProductInCart = cart.products.find(item => item.product_id == productId);


    if (existProductInCart) {
        // Cập nhật số lượng
        const newQuantity = quantity + existProductInCart.quantity;

        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        );
    }
    else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }

        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products: objectCart }
            }

        )
    }
    req.flash("success", "Thêm Thành Công Sản Phẩm Vào Giỏ Hàng");
    res.redirect("back")

}