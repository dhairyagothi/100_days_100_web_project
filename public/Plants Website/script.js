$(document).ready(function(){

    $('.fa-bars').click(function(){
        $(this).toggleClass('fa-time');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('load scroll',function(){
        $('.fa-bars').removeClass('fa-time')
        $('.navbar').removeClass('nav-toggle')
        
        // navbar move function
        if($(window).scrollTop() > 30){
            $('.header').css({'background':'#65b741','box-shadow':'0 .3rem .5rem rgba(0, 0, 0, .3)'})
        }else
        $('.header').css({'background':'none','box-shadow':'none'})
    })
    // FAQ function 
    $('.subject-header').click(function(){
        $('.subject .subject-body').slideUp();
        $(this).next('.subject-body').slideDown();
        $('.subject .subject-header span').text('+')
        $(this).children('span').text('-')
    });
});

/* Readmore button functioning JS Code */
document.addEventListener("DOMContentLoaded", function () {
    let btn = document.getElementById("readBtn");
    let moreText = document.getElementById("moreText");

    btn.addEventListener("click", function () {
        moreText.classList.toggle("hidden");

        let isHidden = moreText.classList.contains("hidden");
        btn.innerText = isHidden ? "Read more" : "Read less";
    });
});
