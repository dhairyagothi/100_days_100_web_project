// Custom JavaScript code can be added here
document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.getElementById('navbar');
    window.onscroll = function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
});
