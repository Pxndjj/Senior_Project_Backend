const Gallery = require("./../models/gallery");
const create= async(obj)=>{
    let res = await Gallery.create(obj);
    return res;
}
const update = async (id,obj)=>{
    let res = await Gallery.findOneAndUpdate({_id:id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await Gallery.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await Gallery.findById(id);
    return res;
}
const findByRefID= async (refID)=>{
    const res = await Gallery.find({ "refID": refID });
    return res;
}
const findAll= async ()=>{
    const res = await Gallery.find();
    return res;
}

module.exports ={create,update,remove,findByID,findAll,findByRefID}


