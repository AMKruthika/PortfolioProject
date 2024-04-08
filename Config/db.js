const mongoose=require('mongoose')
const configDb=async()=>{
    try{
        const db=await mongoose.connect("mongodb://127.0.0.1:27017/Blood-bond-app")
        console.log("connected to db",db.connections[0].name)
    }
    catch(err){
        console.log(err)
    }
}
module.exports=configDb