const User=require('../models/user')
const Group=require('../models/group')
exports.createGroup=(req,res)=>{

    let groupname=req.body.groupname
    let users=req.body.users
    console.log(req.user.name)
    req.user.createGroup({
        
        groupname:groupname,
        users:req.user.id.toString()
        

    }).then(ress=>{
       res.status(200).json("group added")
    })
    .catch(err=>{
        console.error(err)
    })
}
exports.getGroups=(req,res)=>{
    Group.findAll().then(groups=>{
        res.status(200).json(groups)
    })
    .catch(err=>{
        console.error(err)

    })
}
exports.addUserToGroup=async(req,res)=>{
    
    const groupId=req.body.groupid;
    const useremail=req.body.user
    let usertoadd;
  await  User.findOne({where:{email:useremail}}).then(userdata=>{
        
        usertoadd=userdata.id
    })
    .catch(err=>{
        res.json(err)
    })
    console.log(usertoadd)
    

    Group.findByPk(groupId).then(async(group)=>{
       
        let name=group.groupname
        // console.log(group.users.split(" ").push(usertoadd).join())
        let   ans=await group.users.split(',')
   ans.push(usertoadd)
   let ans2=ans.join()
        // let userlist=group.users.split("").push(+usertoadd)
        console.log(typeof group.users);
        
        
       await group.update({groupname:"name",users:ans2})
        return res.status(200).json("user added")
    })
    .catch(err=>{
        return res.status(404).json(err)
    })
    
}
