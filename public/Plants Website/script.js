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

    $('.subject-body').slideUp();
    $('.subject-header span').text('+');

    if($(this).next('.subject-body').is(':visible')){
        $(this).next('.subject-body').slideUp();
        $(this).children('span').text('+');
    }else{
        $(this).next('.subject-body').slideDown();
        $(this).children('span').text('-');
    }
});
});
ScrollReveal().reveal('.row', {
    delay: 200,
    distance: '50px',
    duration: 1000,
    origin: 'bottom',
    reset: false
});