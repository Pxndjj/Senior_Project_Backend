const useUploadfile = require("../models/uploadfile");
const create= async(obj)=>{
    let res = await useUploadfile.create(obj);
    return res;
}
const update = async (id,obj)=>{
    let res = await useUploadfile.findOneAndUpdate({_id:id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await useUploadfile.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await useUploadfile.findById(id);
    return res;
}
const findAll= async ()=>{
    const res = await useUploadfile.find();
    return res;
}
const findByRefID= async (refID)=>{
    const res = await useUploadfile.find({"refID": refID});
    return res;
}



module.exports ={findByRefID,create,update,remove,findByID,findAll}


