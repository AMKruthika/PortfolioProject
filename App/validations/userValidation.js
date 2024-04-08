const User=require('../models/userModel')
const userRegistrationValidationSchema={
    userName:{
        notEmpty:{
            errorMessage:"username is required"
        },trim:true
    },
    email:{
        notEmpty:{
            errorMessage:'email is required'
        },
        normalizeEmail:true,
        isEmail:{
            errorMessage:'email should be in valid email format'
        },
        custom:{
            options:async function(value){
                const user = await User.findOne({email:value})
                if(!user){
                    return true
                }
                else{
                    throw new Error('email already exists')
                }
            }
        },
        trim:true
    },
    password:{
        notEmpty:{
            errorMessage:'password is required'
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'password should vary between 8 and 128 characters'
        },
        trim:true
    },
    role:{
        notEmpty:{
            errorMessage:'role is required'
        },
        isIn:{
            options:[['admin','user','bloodbank']],
            errorMessage:'role should be selected from the above given options'
        },
        trim:true
    }
}
const userLoginValidationSchema={
    email:{
        notEmpty:{
            errorMessage:'email is required'
        },
        normalizeEmail:true,
        isEmail:{
            errorMessage:'email should be in valid email format'
        },
        trim:true,
        custom:{
            options:async function(value,req){
                const user=await User.findOne({email:value})
                if(!user){
                    throw new Error('Register before logging in')
                }
            }
        }
    },
    password:{
        notEmpty:{
            errorMessage:'password is required'
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'password should vary between 8 and 128 characters'
        },
        trim:true
    }
}
module.exports={userRegistrationValidationSchema,userLoginValidationSchema}