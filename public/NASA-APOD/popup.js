
const NASA_API_KEY = "DEMO_KEY";

async function fetchAPOD(date = "") {

    try {

        let url =
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

        if(date){
            url += `&date=${date}`;
        }

        const response = await fetch(url);

        if(!response.ok){
            throw new Error("API failed");
        }

        const data = await response.json();

        document.getElementById("title").textContent =
        data.title;

        document.getElementById("description").textContent =
        data.explanation;

        document.getElementById("image").src =
        data.url;

    } catch(error){

        document.getElementById("title").textContent =
        "Error Loading Content";

        document.getElementById("description").textContent =
        "Unable to load NASA APOD.";

    }
}

document.addEventListener("DOMContentLoaded", () => {

    fetchAPOD();

    document.getElementById("search-btn")
    .addEventListener("click", () => {

        const date =
        document.getElementById("date-search").value;

        fetchAPOD(date);

    });

});
