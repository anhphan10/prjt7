const homeRouter = require("./home.router")
const productRoutes = require("./products.router")
const CategoryMiddleware = require("../../middlewares/client/category.middlewares")
const searchRouter = require("./search.router")
const cartMiddleware = require("../../middlewares/client/cart.middlewares")
const cartRouter = require("./cart.router")
const checkoutRouter = require("./checkout.router")
const userRouter = require("./user.router")

module.exports = (app) => { 

    app.use(CategoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    
    app.use("/" , homeRouter);
    
    
    app.use("/products", productRoutes);
    app.use("/search" , searchRouter);
    app.use("/cart" , cartRouter);
    app.use("/checkout" , checkoutRouter);
    app.use("/user", userRouter);
   
    
}