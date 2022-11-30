var express = require('express');
var router = express.Router();
const Users = require("../models/users");
const { hashPassword, hashCompare,createToken,jwtDecode,validate } = require("../validate/validate");

/* GET users listing. */
router.get("/",validate, async (req, res) => {
  let token=req.headers.authorization.split(" ")[1];
  let data=await jwtDecode(token)
  let user=await Users.findOne({email:data.email})

  if(user){
    let users=await Users.find({},{password:0,__v:0})
    res.send({
      statusCode:200,
      data:users,
    })

  }
  else{
    res.send({
      statusCode:404,
      message:"Unauthorized"
    })

  }
 
});

router.get('/userdetails',async(req,res)=>{
  try{
    let user=await Users.find()
     if(user){
      res.send({
        statusCode:200,
        data:user
      })
     }
     else{
      res.send({
        statusCode:400,
        message:"User does not exist"
      })
     }
  }
  catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
})




router.post("/signup", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email,accountType: "others"});
    if (user) {
      res.send({
        statusCode: 400,
        message: "User already exists",
      });
    } else {
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      let newUser = new Users({
        firstName: req.body.firstName,
          lastName:req.body.lastName,
          email: req.body.email,
          password:req.body.password,
          accountType: "others",
      })
      newUser.save();
      res.send({
        statusCode: 200,
        message: "Sign up successfull",
      });
    }
   
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});


router.post("/signin", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email,accountType: "others" });
    if (user) {
      let hash = await hashCompare(req.body.password, user.password);
      if (hash) {
        let token=await createToken(user.email,user.role)
        res.send({
          statusCode: 200,
          message: "Signin successfull",
          token
        });
      } else {
        res.send({
          statusCode: 400,
          message: "Invalid credentials",
        });
      }
    } else {
      res.send({
        statusCode: 400,
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});


module.exports = router;
