const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const {validationResult}=require('express-validator')
const userCtrlr={}
userCtrlr.register=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body=req.body
        const user=new User(body)
        const count=await User.countDocuments()
        if(count==0){
            user.role="admin"
        }    
        const salt=await bcryptjs.genSalt()
        const encryptedPassword= await bcryptjs.hash(user.password,salt)
        user.password=encryptedPassword
        await user.save()
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
}
userCtrlr.login=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    try{
        const user=await User.findOne({email:body.email})
        if(!user){
           return res.status(404).json({error:"invalid email/password"})
        }
        const checkPassword=await bcryptjs.compare(body.password,user.password)
        if(!checkPassword){
           return res.status(404).json({error:"invalid email/password"})
        }
        const tokenData={
            id:user._id,
            role:user.role
        }
        const token=jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'7d'})
        res.json({token:token})
    }catch(err){
        res.status(500).json({error:'Internal server error'})
    }
    
}
module.exports=userCtrlr