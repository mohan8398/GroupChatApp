const express = require('express');
const jwt=require('jsonwebtoken');

const router = express.Router();

const userController = require('../controller/userController');


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

router.post('/addUser',userController.addUser);
router.post('/loginUser',userController.loginUser);
router.get('/verify',authenticateToken,userController.verifiedUser);
router.post('/sendMessage',authenticateToken,userController.sendMessage);
router.get('/allMessages',authenticateToken,userController.allMessages);
router.get('/getAllUser',authenticateToken,userController.getAllUser);
router.post('/createGroup',authenticateToken,userController.createGroup);
router.get('/getAllGroups',authenticateToken,userController.getAllGroups);
router.post('/sendGroupMessage',authenticateToken,userController.sendGroupMessage);
router.get('/allGroupMessages',authenticateToken,userController.allGroupMessages);
router.post('/addUserToGroup',authenticateToken,userController.addUserToGroup);
router.post('/listOfUser',authenticateToken,userController.listOfUser);
router.post('/removeUserFromGroup',authenticateToken,userController.removeUserFromGroup);
router.post('/addAdmin',authenticateToken,userController.addAdmin);
router.post('/removeAdmin',authenticateToken,userController.removeAdmin);


module.exports=router;
