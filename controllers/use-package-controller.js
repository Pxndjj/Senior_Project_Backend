const usePackage = require("../models/use-package");
const create= async(obj)=>{
    let res = await usePackage.create(obj);
    return res;
}
const update = async (id,obj)=>{
    let res = await usePackage.findOneAndUpdate({_id:id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await usePackage.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await usePackage.findById(id);
    return res;
}
const findAll= async ()=>{
    const res = await usePackage.find();
    return res;
}
const findByRefID= async (refID)=>{
    const res = await usePackage.find({"refID": refID});
    return res;
}



module.exports ={findByRefID,create,update,remove,findByID,findAll}


