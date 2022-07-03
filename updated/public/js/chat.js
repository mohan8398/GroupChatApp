const url = "http://localhost:3000";

let currentId;
let storedMessage=[];
let messageCount=0;
// Authenticate if logged in 
const token=localStorage.getItem('tokenKey');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
}
const mainUrl = window.location.href;
let currentUrl = new URL(mainUrl);
const receiverId=currentUrl.searchParams.get('id');
const receiverName=currentUrl.searchParams.get('name');
document.querySelector('.mainHeader').innerText=receiverName;
document.querySelector('#title').innerText=receiverName;
// const receiverId = currentUrl.substring(currentUrl.lastIndexOf('=')+1);

axios.get(`${url}/verify`,configToken)
.then((result)=>{
    currentId=result.data.id;
})
.catch((error)=>{
    window.location='index.html';
})


const form=document.querySelector('.msgForm form')
const message=document.querySelector('#message');
const chatList=document.querySelector('#chatList');


document.addEventListener('DOMContentLoaded',()=>{
    if(localStorage.getItem(`storedMessage${receiverId}`))
    {
        storedMessage=JSON.parse(localStorage.getItem(`storedMessage${receiverId}`));
        addMessageList(storedMessage);
    }
    if(localStorage.getItem(`messageCount${receiverId}`))
    {
        messageCount=localStorage.getItem(`messageCount${receiverId}`);
    }
    // update();
})

//send messages**************************************
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg={
        message:message.value,
        userId:receiverId
    };
    message.value='';
    axios.post(`${url}/sendMessage`,msg,configToken)
    .then((result)=>{
        // addMessage([result.data],'You');
    })
    .catch((error)=>{
        console.log(error);
    })
})

//add new message to the UI***************************************
const addMessage = (result,sender)=>{
    result.forEach((user)=>{
        const li=document.createElement('li');
        li.innerText=`${sender}: ${user.message}`;
        li.id=`id${user.id}`;
        chatList.appendChild(li);
    })
}

//add previous message to the UI**************************************
const addMessageList = (result)=>{
    result.forEach((element)=>{
        let sender;
        if(receiverId != element.senderId){
            sender=element.user.name;
         }
        else{
            sender=`You`;
        }
        addMessage([element],sender);
    });
}

// make the application realtime******************************************
// use setTimeInterval(() =>. call Api , 1000)
const update=()=>{
    //update the list
    axios.get(`${url}/allMessages?headerMessage=${messageCount}&receiverId=${receiverId}`,configToken)
    .then((result)=>{
            // clear the list
            // const item=document.querySelectorAll('#chatList li');
            // item.forEach((element)=>element.remove());

            const resultData=result.data;
            storedMessage=[...storedMessage, ...resultData];
            messageCount= +messageCount + +result.data.length;

            const diff=storedMessage.length-100;
            if(diff>0)
            {
                console.log(storedMessage.length);
                storedMessage=storedMessage.splice(diff);
                console.log(storedMessage);
                console.log(diff);
            }
            localStorage.setItem(`storedMessage${receiverId}`,JSON.stringify(storedMessage));
            localStorage.setItem(`messageCount${receiverId}`,messageCount);

            if(result.data.length>0)
                addMessageList(result.data);

            // console.log(storedMessage,result.data);
            // console.log(messageCount);
    })
    .catch((error)=>{
        console.log(error);
    })
}

setInterval(()=>{
    update();
},1000);
