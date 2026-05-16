console.log("This is my script");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const errorMsg = document.getElementById("errorMsg");
const usernameInput = document.getElementById("username");
const submitBtn = document.getElementById("submitBtn");
const resultCont = document.getElementById("resultCont");

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = usernameInput.value.trim();

    if (email === "") {
        errorMsg.textContent = "Please enter an email address!";
        return;
    }

    if (!emailRegex.test(email)) {
        errorMsg.textContent = "Invalid email format!";
        return;
    }

    errorMsg.textContent = "";

    resultCont.innerHTML = `
        <div class="loading-container">
            <p>Validating email... Please wait</p>
        </div>
    `;

    try {
        const key = "ema_live_tkRl4T1AMrlwioPCHxe8r1HmTSKkJSLehW9Ti42B";
        const url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`;

        const res = await fetch(url);
        const result = await res.json();

        let str = "";

        for (let k of Object.keys(result)) {
            if (result[k] !== "" && result[k] !== " ") {
                str += `
                    <div class="result-item">
                        <strong>${k}:</strong> ${result[k]}
                    </div>
                `;
            }
        }

        resultCont.innerHTML = str;

    } catch (error) {
        resultCont.innerHTML = `
            <div class="error">
                Something went wrong while validating the email.
            </div>
        `;
        console.log(error);
    }
});
