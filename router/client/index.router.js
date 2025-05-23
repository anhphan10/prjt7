const homeRouter = require("./home.router")
const productRoutes = require("./products.router")
const CategoryMiddleware = require("../../middlewares/client/category.middlewares")
const searchRouter = require("./search.router")
const cartMiddleware = require("../../middlewares/client/cart.middlewares")
const cartRouter = require("./cart.router")
const checkoutRouter = require("./checkout.router")
const userRouter = require("./user.router")
const userMiddleware = require("../../middlewares/client/user.middlewares")
const settingMiddleware = require("../../middlewares/client/setting.middlewares")

module.exports = (app) => { 

    app.use(CategoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.settingGeneral);
    
    app.use("/" , homeRouter);
    
    
    app.use("/products", productRoutes);
    app.use("/search" , searchRouter);
    app.use("/cart" , cartRouter);
    app.use("/checkout" , checkoutRouter);
    app.use("/user", userRouter);
   
    
}