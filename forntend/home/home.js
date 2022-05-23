const addMsgBtn=document.getElementById('addmsgbtn')
const messageInput=document.getElementById('messageinput')
var count=0
document.addEventListener('DOMContentLoaded',async()=>{
    getMessages()
    addmembers()
})

function callingGetMessagesApi(){
   setInterval(()=>{
        getMessages()
        console.log('dshdf')
    
    }
       
     , 1000)
}
callingGetMessagesApi()

function getMessages(){
    let paramString = window.location.href;
    let groupid=paramString.split('groupid=')[1]
    const token= localStorage.getItem('token')
    axios.get(`http://localhost:3000/getMessage?lastmsg=0&groupid=${groupid}`,{
        headers:{"Authorization":token}
    }).then(data=>{
        let messages_cont_ul=document.getElementById("messages_cont_ul")


        if(data.data=='user not allowed'){
            const add_message=document.getElementById('add_message')
            add_message.classList.remove('add_message')
            add_message.classList.add('add_message_none')

            messages_cont_ul.innerHTML="<h1>user not allowed in this group</h1>"
        }
        else{
        
        console.log(data.data)
        const dataa=data.data
     
        for(i=count;i<dataa.length;i++){
            if(i%2==0){
                messages_cont_ul.innerHTML=messages_cont_ul.innerHTML+ ` <li class="even">${dataa[i].username} : ${dataa[i]. msg} </li>`
        
        
            }
            else{
        
            messages_cont_ul.innerHTML=messages_cont_ul.innerHTML+ ` <li >${dataa[i].username} : ${dataa[i]. msg} </li>`
            }
            count=dataa.length;
        }
    }
    })


}



addMsgBtn.addEventListener('click', ()=>{
    const token= localStorage.getItem('token')
    let paramString = window.location.href;
    let groupid=paramString.split('groupid=')[1]
    let msg=messageInput.value
    console.log(messageInput.value)
    messageInput.value=""
    axios.post('http://localhost:3000/addMessage',{
      
       groupid:groupid,
       msg:msg
    },{
        headers:{"Authorization":token}
    }).then(ress=>{
        console.log(ress)
    })
})


function addmembers(){
const addMembersinput=document.getElementById('addMembersinput')
const addMembersBtn=document.getElementById('addMembersBtn')

addMembersBtn.addEventListener('click',(e)=>{
    let paramString = window.location.href;
    let groupid=paramString.split('groupid=')[1]
    const token= localStorage.getItem('token')

    axios.post('http://localhost:3000/addUsertogroup',{
      
        groupid:groupid,
        user:addMembersinput.value
    },{
        headers:{"Authorization":token}
    }).then(ress=>{
        console.log(ress)
        if(ress.data.length>2){
            alert(ress.data)
        }
        else{
            alert("user not found")
        }
       
        addMembersinput.value=''
    })
    
    
})
}
