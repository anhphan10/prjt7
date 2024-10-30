const SettingGeneral = require("../../models/setting-general.model");

//[get]/admin/settings/general
module.exports.general = async (req, res) =>{
    const settingGeneral = await SettingGeneral.findOne({});
    res.render("admin/pages/settings/general",{
        pageTitle: "Cài Đặt Chung",
        settingGeneral:settingGeneral
    });
}
//[patch]/admin/settings/general
module.exports.generalPatch = async (req, res) =>{
    const settingGeneral = await SettingGeneral.findOne({});
    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        },req.body);
    }
    else{
        const record = new SettingGeneral(req.body);
        await record.save();
    }
    req.flash("success" ,"Cập Nhật Thành Công");
    res.redirect("back");
    
}