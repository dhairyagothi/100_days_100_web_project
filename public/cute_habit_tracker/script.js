const inpbox = document.getElementById("inp");
const addbtn = document.getElementById("addbtn");
const habitlist = document.getElementById("habitlist");

addbtn.addEventListener("click",function(){
    const habittext = inpbox.value;
    if(habittext ==""){
        return;
    }

    const li = document.createElement("li");
    li.textContent = habittext;

    const delbtn = document.createElement("button");
    delbtn.textContent ="X";
    delbtn.style.marginLeft="100px";
    delbtn.style.cursor="pointer";
    delbtn.style.background="transparent";
    delbtn.style.border="none";
    delbtn.style.color="Red";
    delbtn.style.fontSize18px;
    delbtn.style.fontWeight="Bold";
    

    delbtn.addEventListener("click",function(){
        li.remove();
    });

    li.appendChild(delbtn);
    habitlist.appendChild(li);
    inpbox.value="";

});