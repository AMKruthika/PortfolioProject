const BloodInventory=require('../models/bloodInventoryModel')
const bloodInventoryValidationSchema={
    blood:{
        notEmpty:{
            errorMessage:'blood is required'
        },
        isObject:{
            errorMessage:'blood field should be an object'
        },
        custom: {
            options: function(value) {
                if (!value || !value.bloodType || !value.bloodGroup) {
                    throw new Error('bloodType and bloodGroup fields are required');
                }
                else{
                    return true
                }
    }
}
    },
    units:{
        notEmpty:{
            errorMessage:'units is required'
        },
        isNumeric:{
            errorMessage:'units should be in number'
        }
    },
    
    donationDate:{
        notEmpty:{
            errorMessage:'donation date is required'
        },
        isDate:{
            errorMessage:' donation date should be in valid date format'
        }
        },
    status:{
        notEmpty:{
            errorMessage:'status is required'
        },
        isIn:{
            options:[['available','booked','expired']],
            errorMessage:'status should be selected from above options',
        }
        
    }
}
module.exports=bloodInventoryValidationSchema