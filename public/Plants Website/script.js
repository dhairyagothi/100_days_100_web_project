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

     // Read more function to toggle the visibility of the additional text and change the button text accordingly
    $('.content').each(function(){
        const $content = $(this);
        const $more = $content.find('.moreext, [id="moreText"], .moreText').first();
        const $btn  = $content.find('.readBtn, [id="readBtn"], button.btn').first();

        if ($btn.length && $more.length) {
            $btn.off('click.readmore').on('click.readmore', function (e) {
                e.preventDefault();
                $more.toggleClass('hidden');
                const isHidden = $more.hasClass('hidden');
                $(this).text(isHidden ? 'Read more' : 'Read less');
            });
        }
    });

});
