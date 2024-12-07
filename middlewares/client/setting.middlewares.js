const SettingGeneral = require("../../models/setting-general.model");

const cache = {}
const setCache = (key , value , ttl)=>{
    const expireAt = Date.now() + ttl;
    cache[key] = {value , expireAt};
}

const getCache = (key) => {
    const cached = cache[key];
    if(!cached){
        console.debug(`cache miss for key ${key}`);
        return;
    }
    if(Date.now() > cached.expireAt){
        console.debug(`cache expired for key ${key}`);
        delete cache[key];
        return;
    }
    console.debug(`cache hit for key ${key}`);
    return cached.value;
}
const ttl = 60 * 1000;
module.exports.settingGeneral = async(req, res, next) =>{
    try {
        let settingGeneral = getCache("settingGeneral")
        if(!settingGeneral){
            settingGeneral = await SettingGeneral.findOne();
            setCache("settingGeneral" , settingGeneral , ttl);
        }
        res.locals.settingGeneral = settingGeneral;
        next();
    } catch (error) {
        console.log(error);
    }
}