document.addEventListener('DOMContentLoaded', () => {
  const metrics = document.querySelectorAll('.metric');

  const animateMetric = (element) => {
    const target = Number(element.dataset.target || 0);
    const increment = target > 100 ? 4 : 1;
    let current = 0;

    const timer = window.setInterval(() => {
      current += increment;

      if (current >= target) {
        element.textContent = target;
        window.clearInterval(timer);
        return;
      }

      element.textContent = current;
    }, 30);
  };

  metrics.forEach((metric) => animateMetric(metric));
});
