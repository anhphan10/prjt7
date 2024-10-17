const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/product")
const Order = require("../../models/order.model")
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
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt Hàng",
        cartDetail: cart
    })
}

//[Post]/checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;

    const userInfo = req.body;
    const cart = await Cart.findOne({
        _id: cartId
    })

    let products = [];
    for (const item of cart.products) {
        const objectProduct =
        {
            product_id: item.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: item.quantity
        }
        const productInfo = await Product.findOne({
            _id: item.product_id
        })
        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;
        products.push(objectProduct);
    }

    const objectOrder = {
        cartId: cartId,
        userInfo: userInfo,
        products: products
    }

    const order = new Order(objectOrder)
    await order.save();
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            products: []
        }
    )
    res.redirect(`/checkout/success/${order.id}`)
}

//[Get]/checkout/success/:orderId
module.exports.success = async (req, res) => {
    // console.log(req.params.orderId);
    const order = await Order.findOne({
        _id: req.params.orderId
    })
    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");
        product.productInfo = productInfo;
        product.priceNew = productHelper.priceNewProduct(product);
        product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt Hàng Thành Công",
        order: order
    })
}