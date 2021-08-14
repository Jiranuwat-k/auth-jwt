const router = require('express').Router();
const verify = require('./verifyToken');

const User = require("../models/User");
router.get("/",verify, async (req,res)=>{
    const user = await User.find({u_id: req.user.u_id});
    const data = {
        "id": user[0].u_id,
        "name": user[0].firstname +" "+ user[0].lastname,
        "email": user[0].email,
        "role": user[0].role,
    };
    res.json(data);
});

module.exports = router;