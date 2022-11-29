const mongoose=require('mongoose')
const validator=require('validator')

var userSchema=new mongoose.Schema(
  {
    accountType: {type:'String', required: true},
    firstName:{type:'String',required:true},
    lastName:{type:'String'},
    email:{
        type:'String',
        required:true,
        lowercase:true,
        validate:(value)=>{
          return validator.isEmail(value)
        }
    },
    password:{type:'String'},
  },
  {
    timestamps: true,
  },
)

module.exports=mongoose.model('users',userSchema)