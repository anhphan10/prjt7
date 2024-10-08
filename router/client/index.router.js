const homeRouter = require("./home.router")
const productRoutes = require("./products.router")
const CategoryMiddleware = require("../../middlewares/client/category.middlewares")
const searchRouter = require("./search.router")

module.exports = (app) => {

    app.use(CategoryMiddleware.category)
    
    app.use("/" , homeRouter)
    
    
    app.use("/products", productRoutes);
    app.use("/search" , searchRouter)
   
    
}