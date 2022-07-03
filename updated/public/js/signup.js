const url = "http://localhost:3000";

const nameId=document.querySelector('#name');
const email=document.querySelector('#email');
const mobile=document.querySelector('#mobile');
const password=document.querySelector('#password');
const cPassword=document.querySelector('#cPassword');
const confirmPasswordText = document.querySelector('#confirmPasswordText');
const  submitButton= document.querySelector('#submitButton');
const submitMessage=document.querySelector('#submitMessage');
const form=document.querySelector('.signupForm');

// JAVSCRIPT CONFIRM PASSWORD VALIDATION
cPassword.addEventListener('keyup',()=>{
    if(password.value.length>0 && cPassword.value===password.value){
        confirmPasswordText.classList.add('active');
        confirmPasswordText.innerText='Password matched';
        submitButton.disabled=false;
    }
    else if(password.value.length>0 && cPassword.value.length>0)
    {
        confirmPasswordText.classList.remove('active');
        confirmPasswordText.innerText='Password not matched';
        submitButton.disabled=true;
    }
})

password.addEventListener('keyup',()=>{
    if(cPassword.value.length>1 && cPassword.value===password.value){
        confirmPasswordText.classList.add('active');
        confirmPasswordText.innerText='Password matched';
        submitButton.disabled=false;
    }
    else if(cPassword.value.length==0)
    {
        confirmPasswordText.innerText='';
        submitButton.disabled=true;
    }
    else if(password.value.length>0 && cPassword.value.length>0){
        confirmPasswordText.classList.remove('active');
        confirmPasswordText.innerText='Password not matched';
        submitButton.disabled=true;
    }
})
// *************************************************************************
// Style form***************************************************************
const input=document.querySelectorAll('input');
input.forEach((element)=>{
    element.addEventListener('focusin',(e)=>{
        e.target.parentElement.children[0].classList.add('active');
    })
    element.addEventListener('focusout',(e)=>{
        if(e.target.value.length<=0)
            e.target.parentElement.children[0].classList.remove('active');
    })
})

// Sending form(************************************************************)
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const obj={
        name:nameId.value,
        email:email.value,
        mobile:mobile.value,
        password:password.value
    }
    nameId.value='';
    email.value='';
    mobile.value='';
    password.value='';
    cPassword.value='';
    axios.post(`${url}/addUser`,obj)
    .then((result)=>{
        submitMessage.innerText='Successfuly signed up';
        submitMessage.classList.add('pass');
        setTimeout(()=>{
            submitMessage.innerText='';
            submitMessage.classList.remove('pass');
        },3000);
    })
    .catch((error)=>{
        console.log(error);
        submitMessage.innerText='User already exists, Please Login';
        submitMessage.classList.add('fail');
        setTimeout(()=>{
            submitMessage.innerText='';
            submitMessage.classList.remove('fail');
        },3000);
    })
})
