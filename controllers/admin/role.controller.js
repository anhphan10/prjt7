const Role = require("../../models/roles.model")
const systemConfig = require("../../config/system")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const records = await Role.find(find)
    res.render("admin/pages/roles/index", {
        pageTitle: " Nhóm Quyền",
        records: records
    })
}

module.exports.create = async (req, res) => {

    res.render("admin/pages/roles/create", {
        pageTitle: " Nhóm Quyền",

    })
}

module.exports.createPost = async (req, res) => {

    //    console.log(req.body);
    try {
        const record = new Role(req.body);
        await record.save();
    }
    catch {
        console.log("Lỗi")
    }
    res.redirect(`${systemConfig.preFixAdmin}/roles`)
}

//Get
module.exports.edit = async (req, res) => {
    const id = req.params.id
    try {
        let find = {
            _id: id,
            deleted: false
        }
        const data = await Role.findOne(find)
        res.render("admin/pages/roles/edit", {
            pageTitle: "Sửa Nhóm Quyền",
            data: data
        });
    }
    catch (error) {
        res.redirect(`${systemConfig.preFixAdmin}/roles`)
    }
}

//Patch

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập Nhật Nhóm Quyền Thành Công");
        
    }
    catch {
        req.flash("error" , "Cập Nhật Thất Bại")
    }
    res.redirect("back");
}

module.exports.detail = async (req , res) => {
    const id = req.params.id;
    let find = {
        _id: id,
        deleted: false
    }

    const data = await Role.findOne(find)

    res.render("admin/pages/roles/detail" , {
        pageTitle: "Trang Chi Tiết",
        data: data
    })
}

//[get] /admin/roles/permissions
module.exports.permissions = async(req, res) => {
   let find = {
    deleted: false
   };
   const records = await Role.find(find);
   res.render("admin/pages/roles/permissions" , {
    pageTitle: "Phân Quyền",
    records: records
   })
}
//[Patch] /admin/roles/permissions
module.exports.permissionsPatch = async(req , res) => {
    // console.log(req.body);
    try{
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        const id = item.id;
        const permissions = item.permissions
        await Role.updateOne({_id:id},{permissions:permissions})
        
    }
    req.flash("success" , "Cập Nhật Phân Quyền Thành Công")
    res.redirect("back")
    }
    catch{
        req.flash("erorr" , "Lỗi!!")
    }
}

//[Delete] /admin/roles/delete
module.exports.deleteRole = async(req, res) => {
     const id = req.params.id;
     try{
      await Role.updateOne({_id:id} , {
        deleted: true,
        deletedAt: new Date()
      })
      req.flash("success", "Xóa Thành Công 1 Quyền");
     }
     catch(erorr)
     {
      req.flash("error" , "Lỗi!!!")
     }
     res.redirect("back")
}