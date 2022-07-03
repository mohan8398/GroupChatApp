const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const ArchiveChat = sequelize.define('archiveChat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    senderId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

module.exports=ArchiveChat;
