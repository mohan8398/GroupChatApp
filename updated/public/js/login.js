const url = "http://localhost:3000";

const email=document.querySelector('#email');
const password=document.querySelector('#password');
const  submitButton= document.querySelector('#submitButton');
const submitMessage=document.querySelector('#submitMessage');
const form=document.querySelector('.signupForm');

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
        email:email.value,
        password:password.value
    }
    email.value='';
    password.value='';
    axios.post(`${url}/loginUser`,obj)
    .then((result)=>{
        // clear previous stored data
        localStorage.clear();
        localStorage.setItem('tokenKey',result.data);
        window.location=`index.html`
    })
    .catch((error)=>{
        console.log(error);
        submitMessage.innerText='Invalid username or password';
        submitMessage.classList.add('fail');
        setTimeout(()=>{
            submitMessage.innerText='';
            submitMessage.classList.remove('fail');
        },3000);
    })
})
