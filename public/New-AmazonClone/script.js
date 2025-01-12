var a = document.querySelector('.add');
var b=document.querySelector('.dropbox-slider');
var x=0;

a.addEventListener('click',function(){
    if(x==0)
    {
    console.log("clicked");
    b.classList.add('active');
    x=1;
    }
})

document.querySelector('.hero').addEventListener("click",function(){
    if(x==1)
    {
    console.log("clicked");
    b.classList.remove('active');
    x=0;
    }
 })
