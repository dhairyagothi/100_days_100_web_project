
        let btn = document.querySelector(".darkmode");
        let lightbtn = document.querySelector(".lightmode");
        let currmode = "light";
        function changeMode() {
            if (currmode == "light") {
                currmode = "dark";
                //    document.querySelector(".lightmode").style.display="block";
                document.querySelector(".container1").style.backgroundColor = "grey";
                document.querySelector(".container2").style.backgroundColor = "black";
                document.querySelector(".image").style.backgroundColor = "grey";
                if (window.matchMedia("(max-width:1098px)").matches) {
                    document.querySelector(".image").style.background = "linear-gradient(#222,#000)";
                }
                document.querySelector(".heading").style.color = "white";
                document.querySelector(".info").style.color = "white";
                document.querySelector(".btn").style.color = "black";
                document.querySelector(".git").style.filter = "invert(1)";
                document.querySelector(".leet").style.filter = "invert(1)";
                btn.style.display = "none";
                lightbtn.style.display = "block";

            } else {
                currmode = "light";
                lightbtn.style.display = "none";
                btn.style.display = "block";
                // document.querySelector(".lightmode").style.display="none";
                document.querySelector(".container1").style.backgroundColor = "#f2d5ed";
                document.querySelector(".container2").style.backgroundColor = "#f5e0f2";
                document.querySelector(".image").style.backgroundColor = "#f2d5ed";
                if (window.matchMedia("(max-width:1098px)").matches) {
                    document.querySelector(".image").style.background = "linear-gradient(#9ad7ff 0%, #fecfef 99%, #fecfef 100%)";
                }
                document.querySelector(".heading").style.color = "black";
                document.querySelector(".info").style.color = "black";
                document.querySelector(".btn").style.color = "white";
                document.querySelector(".git").style.filter = "invert(0)";
                document.querySelector(".leet").style.filter = "invert(0)";


            }
        }
        btn.addEventListener("click", changeMode);
        lightbtn.addEventListener("click", changeMode);



// dark/light mode

// SELECT BUTTON
const modeBtn = document.querySelector(".mode-btn");
// TRACK MODE
let darkMode = false;
// CLICK EVENT
modeBtn.addEventListener("click", () => {
    darkMode = !darkMode;
    // DARK MODE
    if(darkMode){
        document.body.style.background = "#111827";
        document.querySelector(".navbar").style.background = "#1f2937";
        document.querySelector(".navbar").style.borderBottom =
        "1px solid #374151";
        document.querySelector(".logo h2").style.color = "#ffffff";
        document.querySelector(".logo p").style.color = "#d1d5db";
        document.querySelector(".theme-section span").style.color =
        "#ffffff";
        modeBtn.style.background = "#374151";
        modeBtn.style.color = "#ffffff";
        modeBtn.innerHTML = "☀";
    }
    // LIGHT MODE
    else{
        document.body.style.background = "#f8f5fb";
        document.querySelector(".navbar").style.background = "#ffffff";
        document.querySelector(".navbar").style.borderBottom =
        "1px solid #ececec";
        document.querySelector(".logo h2").style.color = "#111827";
        document.querySelector(".logo p").style.color = "#6b7280";
        document.querySelector(".theme-section span").style.color =
        "#374151";
        modeBtn.style.background = "#f3f4f6";
        modeBtn.style.color = "#000000";
    modeBtn.innerHTML = "☾";
    }
});


// feedback section

const stars = document.querySelectorAll(".star");
const textarea = document.querySelector("textarea");
const submitBtn = document.querySelector(".submit-feedback-btn");
let rating = 0;
stars.forEach((star) => {
 star.addEventListener("click", () => {
        
        rating = star.dataset.value;
        stars.forEach((s) => {
            s.classList.remove("active");
        });

        // ADD ACTIVE CLASS
        for(let i = 0; i < rating; i++){
            stars[i].classList.add("active");
        }
    });
});

// SUBMIT BUTTON
submitBtn.addEventListener("click", () => {
    if(rating == 0){
        alert("Please select rating");
        return;
    }
    // GET FEEDBACK
    const feedback = textarea.value;
    console.log("Rating:", rating);
    console.log("Feedback:", feedback);
  alert("Feedback Submitted ✨");

    rating = 0;
    textarea.value = "";

    stars.forEach((star) => {
        star.classList.remove("active");
    });

});
const colors = document.querySelectorAll(".color,.theme");
const container1 = document.querySelector(".container1");
const container2 = document.querySelector(".container2");
const button = document.querySelector(".btn");
colors.forEach((color) => {

    color.addEventListener("click", () => {

        // PINK
        if (color.classList.contains("pink")) {
            container1.style.background = "#f2d5ed";
            container2.style.background = "#f5e0f2";
            button.style.background = "#BB8DB7";
        }

        // BLUE
        else if (color.classList.contains("blue")) {
            container1.style.background = "#dbeafe";
            container2.style.background = "#bfdbfe";
            button.style.background = "#3b82f6";
        }

        // PURPLE
        else if (color.classList.contains("purple")) {
            container1.style.background = "#ede9fe";
            container2.style.background = "#ddd6fe";
            button.style.background = "#8b5cf6";
        }

        // GREEN
        else if (color.classList.contains("green")) {
            container1.style.background = "#d1fae5";
            container2.style.background = "#a7f3d0";
            button.style.background = "#10b981";
        }

        // ORANGE
        else if (color.classList.contains("orange")) {
            container1.style.background = "#ffedd5";
            container2.style.background = "#fed7aa";
            button.style.background = "#f97316";
        }
    });

});


// SELECT INPUTS
const nameInput = document.getElementById("name-input");
const roleInput = document.getElementById("role-input");
const bioInput = document.getElementById("bio-input");

// SELECT CARD TEXT
const cardName = document.getElementById("card-name");
const cardRole = document.getElementById("card-role");
const cardBio = document.getElementById("card-bio");
const saveBtn = document.getElementById("save-btn");


saveBtn.addEventListener("click", () => {
cardName.textContent =
nameInput.value || "Krishna Bhati";
cardRole.textContent =
roleInput.value || "Ui/Ux Designer";
cardBio.textContent =
bioInput.value ||
"Hardworking and reliable UI/UX designer.";
    alert("Changes saved and updated successfully! ✨");

});
 

// RESET BUTTON
const resetBtn = document.querySelector(".reset-btn");

resetBtn.addEventListener("click", () => {

    // RESET INPUT FIELDS
    nameInput.value = "";
    roleInput.value = "";
    bioInput.value = "";

    // RESET CARD CONTENT
    cardName.innerText = "Krishna Bhati";
    cardRole.innerText = "Ui/Ux Designer";

    cardBio.innerText =
    "Hardworking and reliable UI/UX designer focused on going above and beyond to support teams and serve customers.";

    // RESET CARD COLORS
    container1.style.background = "#f2d5ed";
    container2.style.background = "#f5e0f2";
    button.style.background = "#BB8DB7";

    alert("Profile Reset Successfully ✨");

});

// IMAGE 
const uploadBtn = document.getElementById("upload-btn");
const imageInput = document.getElementById("image-input");
const previewImage = document.getElementById("preview-image");
const cardImage = document.querySelector(".image");
// OPEN FILE PICKER
uploadBtn.addEventListener("click", () => {
    imageInput.click();
});
// CHANGE IMAGE
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if(file){
        const imageURL = URL.createObjectURL(file);
        // SIDEBAR IMAGE
        previewImage.src = imageURL;
        // CARD IMAGE
        cardImage.src = imageURL;
    }

});