const express = require('express')
const router=express.Router()
const GroupController=require('../controllers/group')
const verifyLogin=require('../auth/loginVerify')


router.post('/creategroup',verifyLogin.isAuthenticate,GroupController.createGroup)
router.get('/getgroups',verifyLogin.isAuthenticate,GroupController.getGroups)

router.post('/addUsertogroup',GroupController.addUserToGroup)
module.exports=router
