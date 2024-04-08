const {Schema,model}=require('mongoose')
const bloodBankSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    name:String,
    phoneNumber:String,
    address:String,
    geo:[String,String],
    availableBlood:[],
    openingHours:{
        opensAt:{
            hour:Number,
            minutes:Number,
            period:String
        },
        closesAt:{
            hour:Number,
            minutes:Number,
            period:String
        }
    },
    services:[String],
    license:[String],
    photos:[String],
    isApproved:{
    type:String,
    default:'pending'
    }
},{timestamps:true})
const BloodBank=model('BloodBank',bloodBankSchema)
module.exports=BloodBank