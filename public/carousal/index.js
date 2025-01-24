// let carousal = document.querySelector('.carousal');
// let items = document.querySelectorAll('.item');

// document.addEventListener('scroll', () => {
// let primary = carousal.getBoundingClientRect().top/ window.innerHeight;

// let index= Math.ceil(-1.75*(primary+0.5));
// items.forEach((item, i) => {
//     item.className = "item";
//     if (i == index) {
//       item.className = "item active";
//     }
//   });


// })


const leftItems = document.querySelectorAll('.item-left'); // Content blocks
const rightItems = document.querySelectorAll('.item');     // Images

window.addEventListener('scroll', () => {
  let activeIndex = 0;

  // Loop through content blocks to find the active one
  leftItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      activeIndex = index;
    }
  });

  // Update image visibility based on the active content block
  rightItems.forEach((item, index) => {
    if (index === activeIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
});

