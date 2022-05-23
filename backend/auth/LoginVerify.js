const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const saltRounds = 10;


exports. isAuthenticate=(req,res,next)=>{
    try{
        const token=req.header('authorization')
        console.log(req.headers)

        const userId=jwt.verify(token,'jsddsfjk83bsjfbh87bdskfj');
        console.log(userId.id)
        User.findByPk(userId.id).then(user=>{
            console.log(JSON.stringify(user))
            req.user=user;
            console.log("user is"+user)
            next();
        })
        .catch(err=>{
            throw new Error(err)
        })
    }

    catch(err){
        console.log(err)
         res.status(404).JSON({sucess:false})
    }
}
