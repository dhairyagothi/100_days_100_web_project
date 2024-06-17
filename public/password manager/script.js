
function maskPassword(pass){
    let str=""
    for (let index =0; index<Array.length; index++){
        str +="*"

    }
    return str
}
function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            //clipboard successfully set
            //alert("copied the text:" + txt);
            document.getElementById("alert").style.display = "inline"
            setTimeout(() => {
                document.getElementById("alert").style.display = "none"

            }, 2000);
        },
        () => {
            //clipboard write failed
            alert("failed")
        },
    );
}
const deletePassword = (Website) => {
    let data = localStorage.getItem("passwords")
    let arr = JSON.parse(data);
    arrUpdated = arr.filter((e) => {
        return e.Website != Website
    })
    localStorage.setItem("passwords", JSON.stringify(arrUpdated))
    alert(`Successfully deleted ${Website}'s password`)
    showPasswords()
}

//logic to fill the table

const showPasswords = () => {
    let tb = document.querySelector("table")
    let data = localStorage.getItem("passwords")
    if (data == null || JSON.parse(data).length == 0) {
        tb.innerHTML = "No Data To Show"
    }
    else {
        tb.innerHTML = `<tr>
        <th>Website</th>
        <th>Username</th>
        <th>Password</th>
        <th>Delete</th>
    </tr>`
        let arr = JSON.parse(data);
        let str = ""
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];


            str += `<tr>
    <td>${element.Website}<img onclick="copyText('${element.Website}')" src="copy.svg" alt="Copy Button" width="10" height="10"></td>
    <td>${element.username}<img onclick="copyText('${element.username}')" src="copy.svg" alt="Copy Button" width="10" height="10"></td>
    <td>${maskPassword(element.password)}<img onclick="copyText('${element.password}')" src="copy.svg" alt="Copy Button" width="10" height="10"></td>
    <td><button class="btnsm" onclick="deletePassword('${element.Website}')">Delete</button></td>
        </tr>`
        }
        tb.innerHTML = tb.innerHTML + str
    }
    Website.value = ""
    username.value = ""
    password.value = ""
}


console.log("Working");
showPasswords()
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault()
    console.log("Clicked.......")
    console.log(username.value, password.value)
    let passwords = localStorage.getItem("passwords")
    console.log(passwords)
    if (passwords == null) {
        let json = []
        json.push({ Website: Website.value, username: username.value, password: password.value })
        alert("password saved");
        localStorage.setItem("passwords", JSON.stringify(json))
    }
    else {
        let json = JSON.parse(localStorage.getItem("passwords"))
        json.push({ Website: Website.value, username: username.value, password: password.value })
        alert("password saved");
        localStorage.setItem("passwords", JSON.stringify(json))
    }
    showPasswords()

})

