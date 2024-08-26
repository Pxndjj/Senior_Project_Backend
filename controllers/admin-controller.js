const Admin = require("./../models/admin");
const init= async (id)=>{
    let ini =  {
        email: "admin@gmail.com",
      }

    let res = await Admin.create(ini);
    return res;
}
const checkAdmin= async (email)=>{
    const res = await Admin.findOne({ $or: [{ email: email }] });
    return res;
}


module.exports ={checkAdmin,init}


