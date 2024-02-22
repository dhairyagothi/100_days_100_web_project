setInterval(showtime,0);
setInterval(setdate,0);

function showtime(){
let time = new Date() ;
let hour = time.getHours();
let minutes = time.getMinutes();
let seconds = time.getSeconds();
am_pm = "AM";
if(hour>=12){
    hour-=12;
    am_pm="PM";
}
else if (hour==0){
    hr=12;
    am_pm="AM";
}
if(hour<10){
    hour = "0"+hour;
}
if(minutes<10){
    minutes = "0"+minutes;
}if(seconds<10){
    seconds = "0"+seconds;
}
let currenttime = hour+":"+minutes+":"+seconds+" "+am_pm;

document.getElementById("clock").innerHTML=currenttime;
}
function setdate(){
    let today = new Date();
    let date = today.getDate()
    let month = today.getMonth()+1;
    let year = today.getFullYear()
     let day = today.getDay();

   
    let todaydate= date+"/"+ month +"/"+year+","+day;

    document.getElementById("date").innerHTML=todaydate;
}

setdate();
showtime();
