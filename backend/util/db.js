const Sequelize=require('sequelize');

const sequelize=new Sequelize(process.env.DATABASE_NAME,process.env.DB_USER,process.env.DB_USER_PASSWORD,
    {
        dialect:'mysql',
        host:process.env.DB_HOST
    }
)
module.exports=sequelize
