const BloodBank=require('../models/bloodBankModel')
const BloodInventory=require('../models/bloodInventoryModel')
const {validationResult}=require('express-validator')
const bloodInventoryCtrlr={}
bloodInventoryCtrlr.create=async(req,res)=>{
const errors=validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}
try{
    const bloodBank=await BloodBank.findOne({_id:req.params.id})
    if(!bloodBank){
        throw new Error('BloodBank does not exist')
    }
    const {body}=req
   
   const bloodInventory=new BloodInventory(body)
   if(body.blood.bloodType=='plasma'||body.blood.bloodType=='wholeBlood'){
    bloodInventory.expirationCount=365
   }
   else if(body.blood.bloodType=='platelets'){
    bloodInventory.expirationCount=6
   }
   else{
    bloodInventory.expirationCount=40
   }
   const date=new Date(body.donationDate)
   date.setDate(date.getDate()+Number(bloodInventory.expirationCount))
   bloodInventory.expiryDate=date.toISOString().split('T')[0]
   bloodInventory.bloodBank=req.params.id
    bloodInventory.status="available"
     await bloodInventory.save()
    res.status(201).json(bloodInventory)
}catch(err){
    console.log(err)
    res.status(500).json({error:'Internal Server Error'})
}
}
module.exports=bloodInventoryCtrlr