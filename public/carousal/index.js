const leftItems = [...document.querySelectorAll(".item-left")];
const rightItems = [...document.querySelectorAll(".item")];
const railDots = [...document.querySelectorAll(".rail-dot")];

const setActivePlanet = (activeIndex) => {
  leftItems.forEach((item, index) => {
    item.classList.toggle("active", index === activeIndex);
  });

  rightItems.forEach((item, index) => {
    item.classList.toggle("active", index === activeIndex);
  });

  railDots.forEach((dot, index) => {
    const isActive = index === activeIndex;
    dot.classList.toggle("active", isActive);

    if (isActive) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) {
      return;
    }

    const activeIndex = leftItems.indexOf(visibleEntry.target);
    setActivePlanet(activeIndex);
  },
  {
    threshold: [0.25, 0.45, 0.65],
    rootMargin: "-18% 0px -34% 0px",
  }
);

leftItems.forEach((item) => observer.observe(item));

railDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const target = document.getElementById(dot.dataset.target);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
});

setActivePlanet(0);
