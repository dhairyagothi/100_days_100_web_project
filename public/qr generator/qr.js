const getqr = document.querySelector(".submit")
const input = document.querySelector("#inputtext")
 const qrimage = document.getElementById("qrimage");
 const image = document.getElementsByClassName(".image")

const generateqr= ()=>{
    
 qrimage.classList.add("active")
 qrimage.src='https://chart.googleapis.com/chart?chs=100x100&cht=qr&&choe=UTF-8&chl='+input.value;
 
console.log(input.value)
console.log(qrimage.src)
input.value="";
}

getqr.addEventListener("click",generateqr)

