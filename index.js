const express = require("express");
const path = require('path')
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment")

require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const router = require("./router/client/index.router");
const routerAdmin = require("./router/admin/index.router");


database.connect();

const app = express();
const port = process.env.Port;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended:false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//flash
app.use(cookieParser("keyboard cat"));
app.use(session({cookie:{maxAge: 6000}}));
app.use(flash());
//end

//tynimce

app.use('/tinymce' , express.static(path.join(__dirname,'node_modules','tinymce')));
//end


app.locals.prefixAdmin = systemConfig.preFixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

routerAdmin(app);
router(app);
app.get("*",(req,res)=>{
  res.render("client/pages/error/404",{
    pageTitle:"404 Not Found"
  })
})

app.listen(port , () => {
  console.log(`App listenning on port ${port}`);
});