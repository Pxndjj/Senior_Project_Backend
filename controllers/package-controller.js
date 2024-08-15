const Package = require("../models/package");
const create= async(obj)=>{
    let res = await Package.create(obj);
    return res;
}
const update = async (id,obj)=>{
    let res = await Package.findOneAndUpdate({_id:id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await Package.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await Package.findById({ _id: id });
    return res;
}
const findAll= async ()=>{
    const res = await Package.find();
    return res;
}

const onIni= async ()=>{
    const isCheck = await Package.find();
    if(isCheck.length ==0) {
    await Package.create(ini_package);
    }
}
const getID= async ()=>{
   let _id = (await Package.find({ type: "Free" })).map((o)=>{
        return o._id.toString();
      })
    return _id[0];  
}



module.exports ={getID,onIni,create,update,remove,findByID,findAll}


