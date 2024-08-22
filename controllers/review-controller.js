const Review = require("../models/review");

const create= async(obj)=>{
    console.log(obj,123);
    let res = await Review.create(obj);
    return res;
}
const update = async (id,obj)=>{
    let res = await Review.findOneAndUpdate({_id:id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await Review.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await Review.findById({ _id: id });
    return res;
}
const findByRestaurantID= async (id)=>{
    const res = await Review.find({ restaurantID: id });
    return res;
}
const findAll= async ()=>{
    const res = await Review.find();
    return res;
}



module.exports ={create,update,remove,findByID,findAll,findByRestaurantID}

