const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize');

const Chat = require('../model/chat');
const User=require('../model/user');
const Group=require('../model/group');
const GroupMember=require('../model/groupMember');
const GroupChat=require('../model/groupChat');
const sequelize=require('../util/database');

exports.addUser =async (req,res,next) => {
    try{
        const salt=await bcrypt.genSalt(10);
        const encryptedPassword=await bcrypt.hash(req.body.password,salt);
    
        const obj = {
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:encryptedPassword
        }
        User.create(obj)
        .then((result)=>{
            res.status(200).json(result);
        })
        .catch((error)=>{
            res.status(404).json(error);
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}


function generateAccessToken(id) {
    return jwt.sign(id, process.env.TOKEN);
}
exports.loginUser =async (req,res,next) => {
    try{
        let user = await User.findAll({where:{email:req.body.email}});
        bcrypt.compare(req.body.password, user[0].password, function (error, resolved) {
            if (error) {
                console.log("error");
                res.status(401).json({ success: false, message: error });
            }
            if (resolved) {
                const obj = {
                    id: `${user[0].id}`
                };
                const token = generateAccessToken(JSON.stringify(obj));
                res.json(token);
            }
            else {
                res.status(401).json({ success: false, message: "User not authorized" });
            }
        });
    }
    catch(error){
        res.status(404).json({ success: false, message: "User not found" });
    }
}

exports.verifiedUser=(req,res,next)=>{
    User.findByPk(req.user.id)
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.getAllUser = (req,res,next)=>{
    User.findAll({
        where:{
            id:{[Op.ne]:req.user.id}
        }
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}



exports.sendMessage=(req,res,next)=>{
    User.findByPk(req.body.userId)
    .then((result)=>{
        if(result.id){
            return Chat.create({
                message:req.body.message,
                userId:req.user.id,
                senderId:req.body.userId   //check
            })
        }
        else{
            res.status(404).json(error);
        }
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.allMessages=(req,res,next)=>{
    noOfMessage = req.query.headerMessage;
    const receiverId=req.query.receiverId;
    Chat.findAll({
        where:{
            [Op.or]:[
                {senderId:req.user.id,userId:receiverId},
                {senderId:receiverId,userId:req.user.id}
            ]
        },
        include:User,
        offset: +noOfMessage
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.createGroup = (req,res,next)=>{
    let data;
    console.log('hello');
    Group.create({
        name:req.body.name,
        userId:req.user.id
    })
    .then((result)=>{
        data=result;
        return GroupMember.create({
            userId:req.user.id,
            isAdmin:1,
            groupId:result.id
        })
    })
    .then((result)=>{
        res.status(200).json(data);
    })
    .catch((error)=>{
        if(data)
            data.destroy();
        res.status(404).json(error);
    })

}

exports.getAllGroups = (req,res,next)=>{
    GroupMember.findAll({
        where:{userId:req.user.id},
        include:Group
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.sendGroupMessage=(req,res,next)=>{
    console.log(req.body);
    Group.findByPk(req.body.userId)
    .then((result)=>{
        // console.log(result);
        if(result.id){
            return GroupChat.create({
                groupId:req.body.userId,
                message:req.body.message,
                userId:req.user.id
            })
        }
        else{
            res.status(404).json(error);
        }
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.allGroupMessages = (req,res,next)=>{
    noOfMessage = req.query.headerMessage;
    console.log(req.query.groupMessage);
    GroupMember.findAll({
        where:{
            userId:req.user.id,
            groupId:req.query.groupMessage
        }
    })
    .then((result)=>{
        if(result[0]){
        return GroupChat.findAll({
                where:{groupId:req.query.groupMessage},
                include:User,
                offset: +noOfMessage
            })
        }
        else{
            res.status(404);
        }
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.addUserToGroup=(req,res,next)=>{
    let data;
    User.findAll({where:{email:req.body.email}})
    .then((result)=>{
        if(result[0]){
            data=result[0];
            return GroupMember.create({
                userId:result[0].id,
                groupId:req.body.groupId
            })
        }
        else{
            res.status(404).json(error);
        }
    })
    .then((result)=>{
        res.status(200).json(data);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.listOfUser = (req,res,next)=>{
    GroupMember.findAll({
        where:{
            groupId:req.body.groupId,
            userId:{
                [Op.ne]:req.user.id
            }
        },
        attributes:['id','groupId','isAdmin'],
        include:[{
            model:User,
            attributes:['id','name']
        }]
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.removeUserFromGroup = (req,res,next) => {
    GroupMember.findAll({where:{
        userId:req.user.id,
        groupId:req.body.groupId
    }})
    .then((result)=>{
        if(result[0].isAdmin==1){        
            return GroupMember.findAll({
                where:{
                    [Op.and]:{userId:req.body.userId,groupId:req.body.groupId}
                },
                include:User
            })
        }
        else{
            res.status(404);
        }
    })
    .then((result)=>{
        return result[0].destroy()
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.addAdmin = (req,res,next) =>{
    console.log('make Admin');
    GroupMember.findAll({where:{
        userId:req.user.id,
        groupId:req.body.groupId
    }})
    .then((result)=>{
        if(result[0].isAdmin==1){        
            return GroupMember.findAll({
                where:{
                    [Op.and]:{userId:req.body.userId,groupId:req.body.groupId}
                },
                include:User
            })
        }
        else{
            res.status(404);
        }
    })
    .then((result)=>{
        result[0].isAdmin=1;
        return result[0].save()
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}

exports.removeAdmin = (req,res,next) =>{
    console.log('make Admin');
    GroupMember.findAll({where:{
        userId:req.user.id,
        groupId:req.body.groupId
    }})
    .then((result)=>{
        if(result[0].isAdmin==1){        
            return GroupMember.findAll({
                where:{
                    [Op.and]:{userId:req.body.userId,groupId:req.body.groupId}
                },
                include:User
            })
        }
        else{
            res.status(404);
        }
    })
    .then((result)=>{
        result[0].isAdmin=null;
        return result[0].save()
    })
    .then((result)=>{
        res.status(200).json(result);
    })
    .catch((error)=>{
        res.status(404).json(error);
    })
}
