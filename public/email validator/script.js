console.log("This is my script")
let submitBtn = document.getElementById("submitBtn")
let resultCont = document.getElementById("resultCont")
let result = {

    "tag": "",
    "free": true,
    "role": false,
    "user": "monishr6008",
    "email": "monishr6008@gmail.com",
    "score": 0.64,
    "state": "deliverable",
    "domain": "gmail.com",
    "reason": "valid_mailbox",
    "mx_found": true,
    "catch_all": null,
    "disposable": false,
    "smtp_check": true,
    "did_you_mean": "",
    "format_valid": true

}
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    let email = document.getElementById("username").value
    if(email.trim() === ""){
        resultCont.innerHTML = `
        <div class="error">
            Please enter an email address.
        </div>
        `
        return
    }
    resultCont.innerHTML = `
<div class="loading-container">
    <img width="60" src="loading.svg" alt="Loading">
    <p>Validating email... Please wait</p>
</div>
`

    try{

        let key = "ema_live_tkRl4T1AMrlwioPCHxe8r1HmTSKkJSLehW9Ti42B"

        let url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`

        let res = await fetch(url)

        let result = await res.json()

        let str = ``

        for (let key of Object.keys(result)) {

            if(result[key] !== "" && result[key] !== " ") {

                str += `
                <div class="result-item">
                    <strong>${key}:</strong> ${result[key]}
                </div>
                `
            }
        }

        resultCont.innerHTML = str

    }
    catch(error){

        resultCont.innerHTML = `
        <div class="error">
            Something went wrong while validating the email.
        </div>
        `
        console.log(error)
    }
})
