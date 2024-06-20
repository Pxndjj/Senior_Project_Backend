const Admin = require("./../models/admin");

const checkAdmin= async (email)=>{
    const res = await Admin.findOne({ $or: [{ email: email }] });
    return res;
}


module.exports ={checkAdmin}


