const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const Role = require("../../models/roles.model");
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    })
    record.role = role
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh Sách Tài Khoản",
    records: records
  });
}
//[get] admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,

  })

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo Mới Tài Khoản",
    roles: roles
  })
}

//[post] admin/accounts/create
module.exports.createPost = async (req, res) => {

  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false
  })
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại !!!`);
    res.redirect("back");
  }
  else {
    req.body.password = md5(req.body.password)
    const records = new Account(req.body);
    await records.save();
    res.redirect(`${systemConfig.preFixAdmin}/accounts`)
  }
}

//[get] admin/accounts/edit
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false
  }
  try {
    const data = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh Sửa Tài Khoản",
      data: data,
      roles: roles,
    });
  }
  catch (error) {
    res.redirect(`${systemConfig.preFixAdmin}/accounts`);
  }
}

module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;

  try {
    await Account.updateOne({ _id: id }, { status: status })
    req.flash("success", "Cập nhật trạng thái thành công")
  }
  catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại")

  }
  res.redirect("back")
}

//[patch] admin/accounts/edit
module.exports.editPatch = async (req, res) => {
  // res.send("ok");
  // console.log(req.body)
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: {$ne: id},
    email: req.body.email,
    deleted: false
  })

  if (emailExist) {
    req.flash("error", `email ${req.body.email} đã tồn tại`)
    res.redirect("back");
  }
  else {
    if (req.body.password) {
      req.body.password = md5(req.body.password)
    }
    else {
      delete req.body.password
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công")


    res.redirect("back");
  }
}

module.exports.detail = async (req,res) => {
 
  res.render("admin/pages/accounts/detail",{
    pageTitle: "Trang Chi Tiết",
  
  })
}

