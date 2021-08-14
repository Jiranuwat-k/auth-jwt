const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Refreshtoken = require("../models/Refreshtoken");

const expiresIn = process.env.expiresIn;

module.exports = async(req, res) => {
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
        res.json({token: token});
    }
        
    
    
  } catch (err) {
    res.status(400).send("Invalid Refreshtoken");
  }
};