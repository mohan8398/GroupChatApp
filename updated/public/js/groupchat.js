const url = "http://localhost:3000";

let currentId;
let storedGroupMessage=[];
let messageGroupCount=0;
// Authenticate if logged in 
const token=localStorage.getItem('tokenKey');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
}
const mainUrl = window.location.href;
let currentUrl = new URL(mainUrl);
const groupId=currentUrl.searchParams.get('id');
const groupName=currentUrl.searchParams.get('name');
document.querySelector('.mainHeader').innerText=groupName;
document.querySelector('#title').innerText=groupName;
// const groupId = currentUrl.substring(currentUrl.lastIndexOf('=')+1);

axios.get(`${url}/verify`,configToken)
.then((result)=>{
    currentId=result.data.id;
})
.catch((error)=>{
    window.location='index.html';
})
let userCheck;

const form=document.querySelector('.msgForm form')
const message=document.querySelector('#message');
const chatList=document.querySelector('#chatList');

document.addEventListener('DOMContentLoaded',()=>{
    userCheck=localStorage.getItem('user');
    if(localStorage.getItem(`storedGroupMessage${groupId}`))
    {
        storedGroupMessage=JSON.parse(localStorage.getItem(`storedGroupMessage${groupId}`));
        addMessageList(storedGroupMessage);
    }
    if(localStorage.getItem(`messageGroupCount${groupId}`))
    {
        messageGroupCount=localStorage.getItem(`messageGroupCount${groupId}`);
    }
    // update();
})

// side Menu to add user in group**************************************************************************
const messageAdded=document.querySelector('.messageAdded');
const settingBtn=document.querySelector('.setting');
const menuWindow=document.querySelector('.fullMenu');
const addUserGroupForm = document.querySelector('.fullMenu form');
const email=document.querySelector('#addUser');
const listOfUser=document.querySelector('.listOfUser');

settingBtn.addEventListener('click',()=>{
    menuWindow.style.transform=`translateY(0)`;
})
menuWindow.addEventListener('click',(e)=>{
    if(e.target.className==='fullMenu'){
        menuWindow.style.transform=`translateY(100%)`;
    }
})
// list of users in the group
axios.post(`${url}/listOfUser`,{groupId:groupId},configToken)
.then((result)=>{
    console.log(result.data);
    result.data.forEach((element)=>{
        addUserToGroupList(element.user,element.isAdmin);
    })
})
.catch((error)=>{
    console.log(error);
})
const addUserToGroupList = (element,isAdmin)=>{
    const p=document.createElement('p');
    p.innerText=element.name;
    p.id=`user${element.id}`;

    const button=document.createElement('button');
    button.type='button';
    button.innerText='Remove';
    button.className='remove';
    button.classList.add('btnAdd');
    p.appendChild(button);
    if(isAdmin!=1){
        const admButton=document.createElement('button');
        admButton.type='button';
        admButton.innerText='Make Admin';
        admButton.classList.add('btnAdd');
        p.appendChild(admButton);
    }
    else{
        const admButton=document.createElement('button');
        admButton.type='button';
        admButton.innerText='Remove Admin';
        admButton.classList.add('btnAdd');
        p.appendChild(admButton);

    }

    listOfUser.appendChild(p);
}
addUserGroupForm.addEventListener('click',(e)=>{
    if(e.target.className=='remove btnAdd')
    {
        const element = e.target.parentElement.id;
        const id = e.target.parentElement.id.replace('user','');
        axios.post(`${url}/removeUserFromGroup`,{userId:id,groupId:groupId},configToken)
        .then((result)=>{
            document.getElementById(element).remove();
            messageAdded.innerText=`${result.data.user.name} is removed`;
            setTimeout(()=>{
                messageAdded.innerText=``;
            },3000);
        })
        .catch((error)=>{
            console.log(error);
            messageAdded.innerText=`You don't have required permission`;
            setTimeout(()=>{
                messageAdded.innerText=``;
            },3000);
        })
    }
    if(e.target.innerText=='Make Admin'){
        const addButton = e.target;
        const element = e.target.parentElement;
        const id = e.target.parentElement.id.replace('user','');
        axios.post(`${url}/addAdmin`,{userId:id,groupId:groupId},configToken)
        .then((result)=>{
            addButton.remove();
            const admButton=document.createElement('button');
            admButton.type='button';
            admButton.innerText='Remove Admin';
            admButton.classList.add('btnAdd');
            element.appendChild(admButton);
            messageAdded.innerText=`${result.data.user.name} is an admin`;
            setTimeout(()=>{
                messageAdded.innerText=``;
            },3000);
            // addUserToGroupList(result.data.user,result.data.isAdmin);
        })
        .catch((error)=>{
            console.log(error);
            messageAdded.innerText=`You don't have required permission`;
            setTimeout(()=>{
                messageAdded.innerText=``;
            },3000);
        })
    }
    if(e.target.innerText=='Remove Admin'){
        const addButton = e.target;
        const element = e.target.parentElement;
        const id = e.target.parentElement.id.replace('user','');
        axios.post(`${url}/removeAdmin`,{userId:id,groupId:groupId},configToken)
        .then((result)=>{
            addButton.remove();
            const admButton=document.createElement('button');
            admButton.type='button';
            admButton.innerText='Make Admin';
            admButton.classList.add('btnAdd');
            element.appendChild(admButton);
            messageAdded.innerText=`${result.data.user.name} is removed from admin`;
            setTimeout(()=>{
                messageAdded.innerText=``;
            },3000);
        })
        .catch((error)=>{
            console.log(error);
            messageAdded.innerText=`You don't have required permission`;
            setTimeout(()=>{
                messageAdded.innerText=``;
            },3000);
        })
    }
})


addUserGroupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    axios.post(`${url}/addUserToGroup`,{email:email.value, groupId:groupId},configToken)
    .then((result)=>{
        email.value='';
        addUserToGroupList(result.data,null);
        messageAdded.innerText=`Added ${result.data.name} to the group`;
        setTimeout(()=>{
            messageAdded.innerText=``;
        },3000);
    })
    .catch((error)=>{
        messageAdded.innerText=`Mail added or incorrect`;
        setTimeout(()=>{
            messageAdded.innerText=``;
        },3000);
        console.log(error);
    })
})
// *************************************************************************************************

//send messages**************************************
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg={
        message:message.value,
        userId:groupId
    };
    message.value='';
    axios.post(`${url}/sendGroupMessage`,msg,configToken)
    .then((result)=>{
        // console.log(result);
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
        if(element.user.id!= userCheck){
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
    axios.get(`${url}/allGroupMessages?headerMessage=${messageGroupCount}&groupMessage=${groupId}`,configToken)
    .then((result)=>{
            // clear the list
            // const item=document.querySelectorAll('#chatList li');
            // item.forEach((element)=>element.remove());
            const resultData=result.data;
            storedGroupMessage=[...storedGroupMessage, ...resultData];
            messageGroupCount= +messageGroupCount + +result.data.length;

            const diff=storedGroupMessage.length-100;
            if(diff>0)
            {
                console.log(storedGroupMessage.length);
                storedGroupMessage=storedGroupMessage.splice(diff);
                console.log(storedGroupMessage);
                console.log(diff);
            }
            localStorage.setItem(`storedGroupMessage${groupId}`,JSON.stringify(storedGroupMessage));
            localStorage.setItem(`messageGroupCount${groupId}`,messageGroupCount);

            if(result.data.length>0)
                addMessageList(result.data);

            // console.log(storedGroupMessage,result.data);
            // console.log(messageGroupCount);
    })
    .catch((error)=>{
        console.log(error);
    })
}

setInterval(()=>{
    update();
},1000);
