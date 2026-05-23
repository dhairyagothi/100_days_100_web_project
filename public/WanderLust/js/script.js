const filters = document.querySelectorAll(".filter");

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(item => {
            item.style.opacity = "0.7";
        });

        filter.style.opacity = "1";

    });

});