const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async(req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const pass = await User.find({password: verified._pass});

    if(pass === null){
      throw "token_pass Invalid";
    }else{
      req.user = verified;
    }
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
