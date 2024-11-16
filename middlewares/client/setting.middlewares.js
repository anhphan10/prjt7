const NodeCache = require("node-cache");
const cache = new NodeCache({stdTTL:60}); //cache initialization lasts for 1 minute
const SettingGeneral = require("../../models/setting-general.model");

module.exports.settingGeneral = async(req, res, next) =>{
    try {
        let settingGeneral = cache.get("settingGeneral");
        if(!settingGenera){
        //If the data does not exist in memory, perform a query in the data base
            const settingGeneral = await SettingGeneral.findOne();
            console.log(settingGeneral.logo);
            cache.set("settingGeneral" , settingGeneral);
        }
        else{
            console.log("using cached data")
        }
        res.locals.settingGeneral = settingGeneral;
        next();
    } catch (error) {
        console.log(error);
    }
}