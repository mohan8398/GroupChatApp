const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const GroupChat = sequelize.define('groupChat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=GroupChat;
