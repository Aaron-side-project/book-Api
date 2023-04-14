const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    title:{ //房間名稱 如海景房
        type:String,
        required:true,
    },
    desc:{//房間描述 如雙人床與獨立衛浴
        type:String,
        required:true,
    },
    price:{//此房型的價格
        type:Number,
        required:true,
    },
    maxPeople:{//可以住幾人
        type:Number,
        required:true,
    },
    roomNumbers:[{ //這邊是表示到時候的房型編號 如可能房型都是海景房 有分01,02
       number:Number, unavailableDates:[{type:Date}]
    }],//與紀錄01,02被訂走的時間，為到時候calendar紀錄的時間
},{timestamps:true})

module.exports =  mongoose.model("Room", RoomSchema);
