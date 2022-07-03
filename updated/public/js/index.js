const url = "http://localhost:3000";

let userName;
// Authenticate if logged in 
const token=localStorage.getItem('tokenKey');
configToken = {
    headers: {
       Authorization: "Bearer " + token
    }
}
// ***********************************************
const userList=document.querySelector('.userList');

axios.get(`${url}/verify`,configToken)
.then((result)=>{
    localStorage.setItem('user',result.data.id);
})
.catch((error)=>{
    window.location='index.html';
})
// Refresh page
window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || 
                           ( typeof window.performance != "undefined" && 
                                window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      window.location.reload();
    }
  });

//Display all the available place to chat
// user to user
axios.get(`${url}/getAllUser`,configToken)
.then((result)=>{
    result.data.forEach((element)=>{
        const div=document.createElement('div');
        div.innerHTML=`<i class="bi bi-person-circle"></i> ${element.name}`;
        div.className='directChat';
        div.id=`user${element.id}`;

        userList.appendChild(div);
    })
})
.catch((error)=>{
    window.location='login.html';
})
// groupchat
axios.get(`${url}/getAllGroups`,configToken)
.then((result)=>{
    if(result.data.length>0){
        result.data.forEach((element)=>{
            updateScreen(element.group);
        })
    }
})
.catch((error)=>{
    console.log(error);
})



//Direct to chat site
userList.addEventListener('click',(e)=>{
    if(e.target.className==='directChat')
    {
        const id = e.target.id.replace('user','');
        window.location=`chat.html?id=${id}&name=${e.target.innerText}`
    }
    else if(e.target.className==='groupChat'){
        const id = e.target.id.replace('user','');
        window.location=`groupchat.html?id=${id}&name=${e.target.innerText}`
    }
})

//relatime add  group to list
const form=document.querySelector('.groupForm form');
const groupName=document.querySelector('#groupName');

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    axios.post(`${url}/createGroup`,{name:groupName.value},configToken)
    .then((result)=>{
        updateScreen(result.data);
        groupName.value='';
    })
    .catch((error)=>{
        console.log(error);
    })
})

const updateScreen = (result)=>{
    const div=document.createElement('div');
    div.innerHTML=`<i class="bi bi-people-fill"></i> ${result.name}`;
    div.className='groupChat';
    div.id=`user${result.id}`;

    userList.appendChild(div);

}
