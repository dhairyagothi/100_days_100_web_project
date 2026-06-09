$(document).ready(function(){

    var $hamburger = $('#hamburger-btn');
    var $navbar    = $('.navbar');
    var $overlay   = $('#nav-overlay');

    // Open / close the mobile menu
    function openMenu() {
        $hamburger.addClass('open').attr('aria-expanded', 'true');
        $navbar.addClass('nav-toggle');
        $overlay.addClass('active');
        $('body').css('overflow', 'hidden');
    }

    function closeMenu() {
        $hamburger.removeClass('open').attr('aria-expanded', 'false');
        $navbar.removeClass('nav-toggle');
        $overlay.removeClass('active');
        $('body').css('overflow', '');
    }

    $hamburger.on('click', function(){
        if ($navbar.hasClass('nav-toggle')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close when clicking the overlay
    $overlay.on('click', closeMenu);

    // Close when a nav link is clicked (smooth-scroll pages)
    $('.navbar ul li a').on('click', closeMenu);

    // Navbar background on scroll — does NOT close the mobile menu
    $(window).on('load scroll', function(){
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