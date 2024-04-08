const {validationResult}=require('express-validator')
const BloodBank=require('../models/bloodBankModel')
const BloodInventory=require('../models/bloodInventoryModel')
const bloodBankCtrlr={}
bloodBankCtrlr.create=async(req,res)=>{
    console.log(req)
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
   
    try{
        const {body}=req
        console.log('body',body)
        const {files}=req
        console.log('file',files)
        // console.log(req.file)
        const user=await BloodBank.findOne({user:req.user.id})
        
        if(user){
            return res.status(400).json({error:'each BloodBank can have only one profile'})
        }
        
        const bloodBank=new BloodBank({name:body.name,
            user:req.user.id,
        phoneNumber:body.phoneNumber,
        address:body.address,
        blood:body.blood,
        openingHours:{
            opensAt:{
                hour:body.openingHours.closesAt.hour,
                minutes:body.openingHours.closesAt.minutes,
                period:body.openingHours.closesAt.period
            },
            closesAt:{
                hour:body.openingHours.opensAt.hour,
                minutes:body.openingHours.opensAt.minutes,
                period:body.openingHours.opensAt.period
            }
        },
        services:body.services,
        isApproved:'pending',
        license:files.license&&files.license.map(files=>files.path),
        photos: files.photos&&files.photos.map(files=>files.path)
    })
        
        await bloodBank.save()
        res.status(201).json(bloodBank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.listForApproval=async(req,res)=>{
    try{
        const bloodBanks= await BloodBank.find({isApproved:'pending'})
        res.status(201).json(bloodBanks)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.toApprove=async(req,res)=>{
    const id=req.params.id
    const body=req.body
    try{
        const bloodBank=await BloodBank.findOne({_id:id})
        if(!bloodBank){
            res.status(401).json({error:'Blood bank does not exists'})
        }
        const approvedBloodbank=await BloodBank.findByIdAndUpdate(id,body,{new:true})
        res.status(201).json(approvedBloodbank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.show=async(req,res)=>{
    try{
        const id=req.params.id
        const bloodBank=await BloodBank.findOne({_id:id})
        if(!bloodBank){
            throw new Error('Blood bank is not found/approved')
        }
        const availableBlood= await BloodInventory.find({bloodBank:id}).distinct('blood')
        
        bloodBank.availableBlood=availableBlood
        await bloodBank.save()
        res.status(201).json(bloodBank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.listAll=async(req,res)=>{
    try{
        const bloodBanks= await BloodBank.find({isApproved:'approved'})
        res.status(201).json(bloodBanks)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
bloodBankCtrlr.delete=async(req,res)=>{
    try{
        const id=req.params.id
        const bloodbank=await BloodBank.findOne({_id:id})
        if(!bloodbank){
            throw new Error('This blood already does not exist')
        }
        const bloodBank=await BloodBank.findByIdAndDelete({_id:id})
        res.status(500).json(bloodBank)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
module.exports=bloodBankCtrlr