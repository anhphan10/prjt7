const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.router");
const productRouter = require("./products.router")
const productCategoryRoutes = require("./products-category.router")
const roleRouter = require("./role.router")
const accountRouter = require("./account.router")
const authRouter = require("./auth.router")
const authMiddleware = require("../../middlewares/admin/auth.middlewares");
const myAccountRouter = require("./my-account.router")

module.exports = (app) => {
    
   const PATH_ADMIN = systemConfig.preFixAdmin;
   app.use(
      PATH_ADMIN + "/dashboard",
      authMiddleware.requireAuth,
      dashboardRoutes
    );
   app.use(PATH_ADMIN + "/products" , authMiddleware.requireAuth, productRouter);
   app.use(PATH_ADMIN + "/products-category" , authMiddleware.requireAuth, productCategoryRoutes);
   app.use(PATH_ADMIN + "/roles" , authMiddleware.requireAuth, roleRouter);
   app.use(PATH_ADMIN + "/accounts" , authMiddleware.requireAuth, accountRouter);
   app.use(PATH_ADMIN + "/auth" , authRouter);
   app.use(PATH_ADMIN + "/my-account" , authMiddleware.requireAuth, myAccountRouter);

}