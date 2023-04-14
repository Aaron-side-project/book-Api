const mongoose = require('mongoose');

const UserSchma = new mongoose.Schema({
    username:{//用戶名稱
        type:String,
        required:true,//必須上傳
        unique:true,//且不能重複，並免同樣姓名的使用者
    },
    email:{
        type:String,
        required:true,
        unique:true,//信箱也是必須獨一無二
    },
    password:{
        type:String,//密碼
        required:true,
    },
  isAdmin:{
        type:Boolean,//是否為後台管理員身份 所以不一定要先填
        default:false,//就不用 required:true, 只要創建管理員身份時在特別上傳這部分
    },
},{timestamps:true}) //這邊比hotels多了一個timestamps是為了紀錄創建時間戳章，通常後台會需要多再看到user者的創建時間

module.exports =  mongoose.model("User", UserSchma);
