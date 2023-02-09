var express = require('express');
var User=require('../Model/User.js');
let bcrypt = require('bcrypt');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/createuser", function (req, res) {
  res.sendFile('createaccount.html', { root: './public/html' });
});

router.post("/account", createuser,async (req, res) => {
// console.log("/account")
  
  // console.log(response);
  // createuser(response,res);

  res.send(" some data after user has created account")
 
});
router.get('/List', function(req, res) {
  User.find({}, function(err, users) {
  //   const userMap = {};

  //   users.forEach(function(user) {
  //     userMap[user._id] = user;
  //   });

    res.json(users);  
  });
});

async function createuser(req,res,next) {
  const salt = await bcrypt.genSalt();
  const hashedpassword = await bcrypt.hash(req.body.password, salt);

  const response = {
    name: req.body.name,
    password: hashedpassword,
    email: req.body.email,
    empid: req.body.empid,
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
}

module.exports = router;
