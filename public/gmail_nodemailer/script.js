const form=document.getElementById("contactForm");
const message=document.getElementById("message");

form.addEventListener("submit",async(e)=>{
e.preventDefault();

const data={
name:document.getElementById("name").value,
email:document.getElementById("email").value
};

try{
const response=await fetch("http://localhost:5500/send-email",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
});

const result=await response.text();
message.innerText=result;
message.style.color="green";
form.reset();

}catch(error){
message.innerText="Server connection failed";
message.style.color="red";
}
});
