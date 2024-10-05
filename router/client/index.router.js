const homeRouter = require("./home.router")
const productRoutes = require("./products.router")
const CategoryMiddleware = require("../../middlewares/client/category.middlewares")

module.exports = (app) => {

    app.use(CategoryMiddleware.category)
    
    app.use("/" , homeRouter)
    
    
    app.use("/products", productRoutes);
   
    
}