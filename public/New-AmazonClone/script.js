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
// Grab Cart UI Elements
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart-btn');

// Open Cart Sidebar on click
if (cartBtn && cartSidebar) {
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        // Optional: Call a function here to display added products if local storage is used
    });
}

// Close Cart Sidebar on clicking 'X'
if (closeCartBtn && cartSidebar) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
}