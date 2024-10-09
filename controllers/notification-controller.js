const NotificationMessage = require("../models/notification-message");
const moment = require('moment');
moment.locale("en-US");
class ObjectUserNoti {
    constructor(){
        this.user_id=0;
        this.username="";
    }
}
class ObjectNotificationMessage {
    constructor() {
        this.id = 0;
        this.type = "";
        this.title = "";
        this.message = "";
        this.timestamp = moment(new Date());
        this.read = false;
        this.recipient = new ObjectUserNoti();
        this.sender = new ObjectUserNoti();
        this.data =  {};
    }

}
const create= async(obj)=>{
    let res = await NotificationMessage.create(obj);
    return res;
}
const update = async (id,obj)=>{
    let res = await NotificationMessage.findOneAndUpdate({_id:id},{ $set: obj }, { new: true });
    return res;
}
const remove = async (id)=>{
    const res = await NotificationMessage.findOneAndDelete({ _id: id });
    return res;
}
const findByID= async (id)=>{
    const res = await NotificationMessage.findById(id);
    return res;
}

const findByRestuarantID= async (id)=>{
    const res = await NotificationMessage.find({
        $or: [
          { 'recipient.user_id': id },
          { 'sender.user_id': id }
        ],
        read:false,
      }).sort({ createdAt: -1 });
    return res;
}

const findAll= async ()=>{
    const res = await NotificationMessage.find();
    return res;
}




module.exports ={ObjectNotificationMessage,ObjectUserNoti,create,update,remove,findByID,findAll,findByRestuarantID}


