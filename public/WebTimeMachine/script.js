document.addEventListener("DOMContentLoaded", () => {
    const yearSlider = document.getElementById("yearSlider");
    const yearDisplay = document.getElementById("yearDisplay");
    const body = document.body;

    function getEra(year) {
        if (year < 2000) return "1990s";
        if (year >= 2000 && year < 2010) return "2000s";
        if (year >= 2010 && year < 2020) return "2010s";
        return "2020s"; 
    }

    yearSlider.addEventListener("input", (e) => {
        const selectedYear = parseInt(e.target.value, 10);
        
        yearDisplay.textContent = selectedYear;

        const currentEra = getEra(selectedYear);
        body.setAttribute("data-era", currentEra);
    }); 
});