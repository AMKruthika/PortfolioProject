const {Schema,model}=require('mongoose')
const bloodInventorySchema=new Schema({
user:{ 
    type:Schema.Types.ObjectId,
    ref:'User'
},
bloodBank:{
    type:Schema.Types.ObjectId,
    ref:'BloodBank'
},
blood:{
    bloodType:String,
    bloodGroup:String
},
units:Number,
expirationCount:Number,
donationDate:Date,
expiryDate:Date,
status:{
    type:String,
    enum:['available','booked','expired'],
    default:'available'
}
},{timestamps:true})
const BloodInventory=model('BloodInventory',bloodInventorySchema)
module.exports=BloodInventory