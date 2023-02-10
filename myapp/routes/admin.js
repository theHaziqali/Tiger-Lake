var express = require('express');
var User=require('../Model/User.js');
let bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken");


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("here")
  res.render('admin', { title: 'Express' });
});
router.get("/createaccount", function (req, res) {
  res.sendFile('createaccount.html', { root: './public/html' });
});

router.post("/account", createuser,async (req, res) => {
// console.log("/account")
//   const salt = await bcrypt.genSalt();
//   const hashedpassword = await bcrypt.hash(req.body.password, salt);

//   const response = {
//     name: req.body.name,
//     password: hashedpassword,
//     email: req.body.email,
//     empid: req.body.empid,
//   };
//   // console.log(response);
//   createuser(response,res).then(result=>{res.end(JSON.stringify(result)),console.log(result)})
  // console.log(result)
  

  // res.send((result));
  res.send("User created")
  //Some usefull information for the Admin
 
});
const verifyUser = (req, res, next) =>{
  // console.log(JSON.stringify(req.headers));
  const refreshToken=req.headers.accesstoken
  jwt.verify(refreshToken,process.env.ACCESS_TOKEN_SECRET,(err,user)=>
      {
        if(err) return res.sendStatus(403)
        if(req.body.admin ==1)        
        next()
      })
next()
}  
router.post("/blockuser",verifyUser ,async (req, res) => {
  console.log("block user")
  console.log(req.headers.accesstoken)
//    if(req.header.accesstoken=="eyJhbGciOiJIUzI1NiJ9.aHplQGdtYWlsLmNvbQ.e67zRlH_hDQAnSAuHDsZX9kKmKbNrm4E64TtAkbK-E8.a2FrYXNoaW9mbGVhZkBnbWFpbC5jb20.37jgkCg6hM3L2TVvgLh_opTgmNNJNA_KS6RcEdtwasA")
//  { 
 
// }
await User.findOne({email:req.body.email},(err,doc)=>{
    if(err){
      console.log(err)
    }
    else if(doc){
      if(doc.admin==0){
        doc.isblocked=1
        User.updateOne(doc,(err,doc)=>{
          if(err)
          console.log(err)
        })
              console.log(doc)
          // next()
      }
    }
  }).clone()
  .catch(function (err) {
    console.log(err);
  });
  // next()

  
 res.send("user blocked")
   
  });
  

router.post("/signin_proccess", async (req, res) => {
  // Prepare output in JSON format
  console.log("/sign_proccess");
  const muser = await User.findOne(
    { email: req.body.email },
    function (err, doc) {
      if(doc.isblocked==1){
        res.send("user is blocked")
        return
      }
    }
  )
    .clone()
    .catch(function (err) {
      console.log(err);
    });
  console.log(muser);
  if (muser == null) {
    res.status(501).send();
  }

  try {
    console.log(req.body.password,muser.password);
    if (await bcrypt.compare(req.body.password, muser.password)) {
    //   res.send("Success");
    user=muser.email
    //jwt token are used to verify the actual user and does not allow the user for life time access(token expires).
    const accesstoken=generateaccesstoken(user) 
    const refreshToken=jwt.sign( {id: user[req.body.email]},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'15mins'})
    // refreshTokens.push(refreshToken)
    // await Token.create({token:refreshToken})
    console.log("allowed")
    res.json({accesstoken:accesstoken,refreshToken:refreshToken})
    } else res.send("Not allowed");
  
    
} catch (err) {
    res.send(err.message);
  }
  
});
async function blockuser(req,res,next) {
  if(req.header.accesstoken=="eyJhbGciOiJIUzI1NiJ9.aHplQGdtYWlsLmNvbQ.e67zRlH_hDQAnSAuHDsZX9kKmKbNrm4E64TtAkbK-E8.a2FrYXNoaW9mbGVhZkBnbWFpbC5jb20.37jgkCg6hM3L2TVvgLh_opTgmNNJNA_KS6RcEdtwasA")
 { 
 
}await User.findOne({email:req.body.email},(err,doc)=>{
    if(err){
      console.log(err)
    }
    else{
      if(doc.admin==0){
        doc.isblocked=1
        User.updateOne(doc,(err,doc)=>{
          if(err)
          console.log(err)
        })
              console.log(doc)
          next()
      }
    }
  }).clone()
  .catch(function (err) {
    console.log(err);
  });
  next()
}

async function createuser(req,res,next) {
  const salt = await bcrypt.genSalt();
  const hashedpassword = await bcrypt.hash(req.body.password, salt);

  const response = {
    name: req.body.name,
    password: hashedpassword,
    email: req.body.email,
    empid: req.body.empid,
    admin:1,
  };
  console.log("creating user")
  User.exists({email:response.email},function(err,doc){
    if(err){
      console.log(err)
    }
    else if(doc==null){
      User.create(response).then(result=>{console.log("User Created")})
      // res.body="user created"
      next()

    }
    else{
      console.log("User already Exists!",doc)
      return
    }
  }
  
);

// res.end(JSON.stringify(response));
  // return user;
  next()
}
function generateaccesstoken(user){
  return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
}

module.exports = router;
