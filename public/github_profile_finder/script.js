const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const profileContainer = document.getElementById("profileContainer");
const themeToggle = document.getElementById("themeToggle");

searchBtn.addEventListener("click", () => {
  const username = searchInput.value.trim();

  if(username === ""){
    profileContainer.innerHTML = `
      <p class="error">Please enter username</p>
    `;
    return;
  }

  fetchProfile(username);
});

searchInput.addEventListener("keypress",(e)=>{
  if(e.key === "Enter"){
    searchBtn.click();
  }
});

async function fetchProfile(username){

  try{

    profileContainer.innerHTML = `
      <p>Loading...</p>
    `;

    const response = await fetch(
      `https://api.github.com/users/${username}`
    );

    if(response.status === 404){

      profileContainer.innerHTML = `
        <p class="error">User not found</p>
      `;

      return;
    }

    const data = await response.json();

    displayProfile(data);

  }
  catch(error){

    profileContainer.innerHTML = 
    `<p class="error">Something went wrong</p>`;

  }

}

function displayProfile(user){

  profileContainer.innerHTML = `

    <div class="profile-card">

      <img src="${user.avatar_url}">

      <h2>${user.name || "No Name"}</h2>

      <p>@${user.login}</p>

      <p>${user.bio || "No bio available"}</p>

      <div class="stats">

        <div>
          <h3>${user.followers}</h3>
          <p>Followers</p>
        </div>

        <div>
          <h3>${user.following}</h3>
          <p>Following</p>
        </div>

        <div>
          <h3>${user.public_repos}</h3>
          <p>Repos</p>
        </div>

      </div>

      <p>📍 ${user.location || "Location not available"}</p>

      <a href="${user.html_url}" target="_blank">
        Visit Profile
      </a>

    </div>

  `;
}

themeToggle.addEventListener("click",()=>{

  document.body.classList.toggle("light");

  if(document.body.classList.contains("light")){
    themeToggle.innerHTML =
      `<i class="fa-solid fa-sun"></i>`;
  }
  else{
    themeToggle.innerHTML =
      `<i class="fa-solid fa-moon"></i>`;
  }

});