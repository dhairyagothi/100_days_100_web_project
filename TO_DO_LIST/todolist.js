
let task=document.getElementById("newtask")
let container=document.querySelector(".container")

function Add(){
    if (task.value==""){
        alert("Please enter a task");
    }
    else{
        let newelement =document.createElement("li")
        newelement.innerHTML= newtask.value + '<i class="fa-solid fa-trash"></i>'+'<a>&#10003</a>'
        container.appendChild(newelement);
        task.value="";
    newelement.querySelector("i").addEventListener("click",remove)
        function remove(){
            newelement.remove()
        }
    newelement.querySelector("a").addEventListener("click",strike)
        function strike(){
            newelement.style.textDecoration="line-through"
        }

    }
}
function c1(){
    let image = 'linear-gradient(90deg, rgba(232,221,227,1) 33%, rgba(219,185,200,1) 100%, rgba(227,230,235,1) 100%)'
    document.body.style.background= image 
}
function c2(){
    let image = ' linear-gradient( 90deg, #e4afcb 0%, #b8cbb8 0%, #b8cbb8 0%, #e2c58b 30%, #c2ce9c 64%, #7edbdc 100%)'
    document.body.style.background= image
}
function c3(){
    let image='linear-gradient(90deg, #39db8c, #a0c559, #d1ab51, #e6936b, #df868d)'
    document.body.style.background=image
}
