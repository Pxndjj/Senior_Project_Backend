const Admin = require("./../models/admin");
const create= async(obj)=>{
    let res = await Admin.create(obj);
    return res;
}
const update = async (id,obj)=>{
    let res = await Admin.findOneAndUpdate({_id:id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await Admin.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await Admin.findById(id);
    return res;
}
const findAll= async ()=>{
    const res = await Admin.find();
    return res;
}
const init= async (id)=>{
    let ini =  {
        email: "joyfulwait@gmail.com",
      }

    let res = await Admin.create(ini);
    return res;
}
const checkAdmin= async (email)=>{
    const res = await Admin.findOne({ $or: [{ email: email }] });
    return res;
}


module.exports ={checkAdmin,init,create,update,remove,findByID,findAll}


