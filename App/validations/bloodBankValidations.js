const BloodBank=require('../models/bloodBankModel')
const bloodBankValidationSchema={
    name:{
            notEmpty:{
                errorMessage:'blood bank name is required'
            },
            trim:true
        },
        
    phoneNumber:{
        notEmpty:{
            errorMessage:'phone number is required'
        },
        custom:{
            options:async function(value){
                
                const user= await BloodBank.findOne({phoneNumber:value})
                    if(user){
                        throw new Error('Phone number already in use')
                    }
                    if(value.length!==10 || isNaN(Number(value))){
                        throw new Error('phone number is not valid')
                    }

                }
            },
            trim:true
        },
        
    

    address:{
        notEmpty:{
            errorMessage:'address is required'
        }
    },
    openingHours:{
    custom: {
        options: function(value) {
            if (!value || !value.opensAt || !value.closesAt) {
                throw new Error('opensAt and closesAt fields are required');
            }

            const opensAtParts = value.opensAt;
            if (!opensAtParts || !opensAtParts.hour || !opensAtParts.minutes || !opensAtParts.period) {
                throw new Error('Invalid opensAt value');
            }

            const closesAtParts = value.closesAt;
            if (!closesAtParts || !closesAtParts.hour || !closesAtParts.minutes || !closesAtParts.period) {
                throw new Error('Invalid closesAt value');
            }

            // Additional validation logic for opensAt and closesAt values can be added here

            return true;
        }
    }
},
services:{
        in:['body'],
        custom: {
            options: function(value){
                if(!Array.isArray(value)) {
                    throw new Error('services should be array')
                }
                if(value.length == 0) {
                    throw new Error('must contain atleast one service')
                }
                if(value.every(ele => typeof ele != 'string')) {
                    throw new Error('service should be a string')
                }
                else{
                return true 
                }
            }
        }
    },

    license:{
        custom:{
            options:function(value,{req}){
                if(req.files&&req.files.license){
                    return true
                }
                if((!Array.isArray(value))){
                    throw new Error('license should be array')
                }
                if(value.length<1){
                    throw new Error('license one photo is required')
                }
                   else{
                    throw new Error('License is required')
                }
            }
        }
    },
    photos:{
        custom:{
            options:function(value,{req}){
                if(!(req.files&&req.files.photos)){
                    throw new Error('photo is required')
                }
                if(req.files.length<1){
                    throw new Error('Atleast one photo is required')
                }
                else{
                    return true
                }
            }
        }
    },
    isApproved:{
        notEmpty:{
            errorMessage:'Approval status is required'
        },
        isIn:{
            options:[['pending','approved','declined']]
        }
    }
}
const approvalStatusValidationSchema={
    isApproved:{
        notEmpty:{
            errorMessage:'Approval status is required'
        },
        isIn:{
            options:[['pending','approved','declined']]
        }
    }
}


module.exports={bloodBankValidationSchema,approvalStatusValidationSchema}