const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const dayjs = require('dayjs');

const User = require("../models/User");
const Refreshtoken = require("../models/Refreshtoken");
const validate = require("../validation");


const expiresIn = process.env.expiresIn;

router.post("/register", async (req, res) => {
  const { error } = validate.register(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hash_Password = await bcrypt.hash(req.body.password, salt);
  const u_id = randtoken.uid(16);
  const user = new User({
    u_id: u_id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    birthday: req.body.birthday,
    role: "User",
    email: req.body.email,
    password: hash_Password,
  });
  try {
    await user.save();
    res.send("Register Success");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = validate.login(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Email is wrong");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");
  //Create and assign a token
  
  const token = jwt.sign({ u_id: user.u_id ,_pass: user.password, role: user.role}, process.env.TOKEN_SECRET, {expiresIn});
  
  const uuid = randtoken.uid(256);
  const refreshToken = jwt.sign({uuid:uuid , _pass: user.password }, process.env.REFRESH_TOKEN_SECRET);
  
  const refresh_token = new Refreshtoken({
    uuid: uuid,
    email: user.email,
  });
  try {
    await refresh_token.save();
    res.header("refresh-token", refreshToken);
    res.header("auth-token", token).status(200).send();
  } catch (err) {
    res.status(400).send(err);
  }
  
  
});

router.post('/token', async (req,res)=>{
  const refreshtoken = req.header("refresh-token");
  if (!refreshtoken) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    const db_refreshtoken = await Refreshtoken.findOne({ uuid: verified.uuid});
    const user = await User.findOne({ password: verified._pass });
    
    if (db_refreshtoken === null){
        throw "refreshtoken uuid Invalid"
    }
    if (verified._pass === null){
        throw "refreshtoken pass Invalid"
    }else{
        const token = jwt.sign({ u_id: user.u_id ,_pass: user.password, role: user.role}, process.env.TOKEN_SECRET, {expiresIn});
        res.header("auth-token", token).status(200).send();
    }
        
    
    
  } catch (err) {
    res.status(400).send("Invalid Refreshtoken");
  }
});

router.post('/token/reject',async (req,res)=>{
  try{
    let jwt_token = jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let deleted = await Refreshtoken.deleteOne({uuid: jwt_token.uuid});
    if( deleted.n === 0){
      throw "err not refreshtoken";
    }
    res.send("deleted success!").status(204);
  } catch (err){
    res.send("Invalid token").status(404);
  }
})

module.exports = router;
