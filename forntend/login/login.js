const form=document.getElementById('login_form')

document.addEventListener('DOMContentLoaded',()=>{
    token=localStorage.getItem('token')

    if(token){
        window.location.replace('./home.html');
    }
})

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
   const email= e.target.email.value
   const password= e.target.password.value
   console.log(password);
   axios.post('http://localhost:3000/login',{
    email,password
   }).then(data=>{
    console.log(data.status)
       if(data.status==200){
        console.log(data.data.token)
        console.log(data.data.email)
        console.log(data.data.name)
        localStorage.setItem("token",data.data.token)
        localStorage.setItem("user",JSON.stringify({'name':data.data.name,'email':data.data.email}))
       
       }
       else if(data.status==404){
        console.log("user not found") 
       }
       else if(data.status==401){
        console.log("password incorrect") 
       }
       
   }).then(()=>{
       console.log('login sucess')
         window.location.replace('../groups/groups.html');
   })
   .catch(error=>{
       console.log(error)
   })
} )
