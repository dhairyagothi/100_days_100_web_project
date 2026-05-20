const leftItems = document.querySelectorAll('.item-left'); // Content blocks
const rightItems = document.querySelectorAll('.item');     // Images

// Inject planet name heading between image and View More button
rightItems.forEach((item, index) => {
  const leftItem = leftItems[index];
  const name = leftItem ? leftItem.querySelector('.text').textContent.trim() : '';
  const btn = item.querySelector('button');
  if (btn && name) {
    const title = document.createElement('h2');
    title.className = 'planet-title';
    title.textContent = name;
    item.insertBefore(title, btn);
  }
});

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
      // Reset expanded state when scrolling away from a planet
      if (item.classList.contains('expanded')) {
        item.classList.remove('expanded');
        const info = item.querySelector('.planet-info');
        if (info) info.style.height = '';
        const btn = item.querySelector('button');
        if (btn) btn.textContent = 'View More';
      }
      item.classList.remove('active');
    }
  });
});


// View More / View Less — smooth JS height animation
document.querySelectorAll('.item button').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.item');
    const info = item.querySelector('.planet-info');
    const isExpanding = !item.classList.contains('expanded');

    if (isExpanding) {
      // Step 1: measure actual height
      info.style.height = 'auto';
      const targetHeight = info.scrollHeight + 'px';
      info.style.height = '0px';

      // Step 2: force reflow, then animate to target height
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          info.style.height = targetHeight;
        });
      });

      item.classList.add('expanded');
      btn.textContent = 'View Less';
    } else {
      // Collapse: animate height back to 0
      info.style.height = info.scrollHeight + 'px';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          info.style.height = '0px';
        });
      });

      // Remove class after transition ends
      setTimeout(() => {
        item.classList.remove('expanded');
        btn.textContent = 'View More';
        info.style.height = '';
      }, 520);
    }
  });
});
