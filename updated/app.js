const url=`http://localhost:3000`

const path=require('path');

const express = require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const cron = require('node-cron');

dotenv.config();

const sequelize=require('./util/database');

const userRouter=require('./router/userRouter');

const User=require('./model/user');
const Chat=require('./model/chat');
const ArchiveChat=require('./model/archiveChat');
const Group=require('./model/group');
const GroupMember=require('./model/groupMember');
const GroupChat=require('./model/groupChat');


const app=express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());


User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(GroupMember);
GroupMember.belongsTo(Group);
User.hasMany(GroupMember);
GroupMember.belongsTo(User);

User.hasMany(GroupChat);
GroupChat.belongsTo(User);


//Delete 1 day old chats
cron.schedule('59 23 * * *', function() {
    const today = new Date()
    const yesterday = new Date(today)
    
    yesterday.setDate(yesterday.getDate() - 1)
    
    today.toDateString()
    yesterday.toDateString()
    Chat.findAll({
        where:{
            createdAt:{
                [Op.lte]: yesterday
            }
        }
    })
    .then(result=>{
        result.forEach((output)=>{
            let data=output;
            ArchiveChat.create({
                message:output.message,
                senderId:output.senderId,
                userId:output.userId
            })
            .then(()=>{
                data.destroy();
            })
        })
    })
    .catch((error)=>{
        console.log(error);
    })
});
app.use(userRouter);
app.get('/',(req,res,next)=>{
    res.redirect(`${url}/login.html`);
})

sequelize
.sync()
.then(()=>{
    app.listen(3000);
})
.catch((error)=>{
    console.log(error);
})
