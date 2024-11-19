const SettingGeneral = require("../../models/setting-general.model");

const cache = {}
const setCache = (key , value , ttl)=>{
    const expireAt = Date.now() + ttl;
    cache[key] = {value , expireAt};
}

const getCache = (key) => {
    const cached = cache[key];
    if(!cached){
        return;
    }
    if(Date.now() > cached.expireAt){
        delete cache[key];
        return;
    }
    return cached.value;
}
const ttl = 60 * 1000;
module.exports.settingGeneral = async(req, res, next) =>{
    try {
        let settingGeneral = getCache("settingGeneral")
        if(!settingGeneral){
            const settingGeneral = await SettingGeneral.findOne();
            setCache("settingGeneral" , settingGeneral , ttl);
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