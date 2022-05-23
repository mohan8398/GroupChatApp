const express = require('express')
const router=express.Router()
const MessageController=require('../controllers/message')
const verifyLogin=require('../auth/loginVerify')


router.post('/addMessage',verifyLogin.isAuthenticate,MessageController.addMeassage)
router.get('/getMessage',verifyLogin.isAuthenticate,MessageController.getMeassages)
module.exports=router
