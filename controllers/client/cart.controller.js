
const Cart = require("../../models/cart.model")
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