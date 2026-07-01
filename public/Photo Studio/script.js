    document.getElementById('menuToggle').addEventListener('click', function () {
      document.getElementById('navLinks').classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.getElementById('navLinks').classList.remove('open');
      });
    });

    document.querySelector('.contact-form').addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
    });
