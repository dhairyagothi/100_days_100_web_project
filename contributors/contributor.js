const modal = document.getElementById('profileModal');

const modalBody = document.getElementById('modalBody');

const closeModal = document.getElementById('closeModal');

const certificateModal = document.getElementById('certificateModal');

const certificateBody = document.getElementById('certificateBody');

const closeCertificate = document.getElementById('closeCertificate');

closeModal?.addEventListener(
  'click',

  () => {
    modal.style.display = 'none';
  }
);

window.addEventListener(
  'click',

  (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  }
);

async function openProfile(username, commits) {
  modal.style.display = 'flex';

  modalBody.innerHTML = `
        <p>Loading profile...</p>
    `;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    const user = await response.json();

    modalBody.innerHTML = `

            <img
            src="${user.avatar_url}"
            >

            <h2>
            ${user.name || user.login}
            </h2>

            <p>
            ${user.bio || 'This contributor has not added a bio yet.'}
            </p>

            <p>
            Followers:
            ${user.followers}
            </p>

            <p>
            Public Repos:
            ${user.public_repos}
            </p>

            <p>
            Location:
            ${user.location || 'Not available'}
            </p>

            <p>
            Joined:
            ${new Date(user.created_at).toLocaleDateString()}
            </p>

           <div class="popup-btn-container">

    <a
    href="${user.html_url}"
    target="_blank"
    class="github-btn"
    >

    View GitHub

    </a>


    <button
    id="downloadCertificate"
    class="certificate-btn"
    >

    Download Certificate

    </button>

</div>

        `;

    const certificateBtn = document.getElementById('downloadCertificate');

    closeCertificate?.addEventListener(
      'click',

      () => {
        certificateModal.style.display = 'none';
      }
    );

    certificateBtn?.addEventListener(
      'click',

      () => {
        certificateModal.style.display = 'flex';

        certificateBody.innerHTML = `

<div style="
position:relative;
width:100%;
">

<img
src="assets/template.png"
style="
width:100%;
display:block;
border-radius:12px;
">


<!-- NAME -->

<div style="
position:absolute;
top:35%;
left:50%;
transform:translateX(-50%);
font-family:'Cinzel',serif;

font-size:24px;

font-weight:700;

background:
linear-gradient(
90deg,
#b8860b,
#f4d03f,
#8b5a00
);

-webkit-background-clip:text;

-webkit-text-fill-color:
transparent;

white-space:nowrap;

text-shadow:
0 2px 4px rgba(
0,
0,
0,
0.12
);
">

${user.name || user.login}

</div>



<!-- COMMITS -->

<div style="
position:absolute;
top:82%;
left:30%;
transform:translateX(-50%);
font-size:5px;
color:#5b21b6;
">

${commits}

</div>



<!-- USERNAME -->

<div style="
position:absolute;
top:82%;
left:50%;
transform:translateX(-50%);
font-size:5px;
color:#5b21b6;
">

@${user.login}

</div>



<!-- DATE -->

<div style="
position:absolute;
top:82%;
left:69%;
transform:translateX(-50%);
font-size:5px;
color:#5b21b6;
">

${new Date().toLocaleDateString('en-GB')}

</div>

</div>


<div style="
text-align:center;
margin-top:20px;
">

<button
id="downloadPdfBtn"
style="
background:#16a34a;
padding:14px 30px;
color:white;
border:none;
border-radius:10px;
cursor:pointer;
">

Download PDF

</button>

</div>

`;
        const downloadBtn = document.getElementById('downloadPdfBtn');

        downloadBtn?.addEventListener(
          'click',

          async () => {
            const certificate = certificateBody.querySelector('div');

            const canvas = await html2canvas(
              certificate,

              {
                scale: 3,

                useCORS: true,
              }
            );

            const image = canvas.toDataURL('image/png');

            const { jsPDF } = window.jspdf;

            const pdf = new jsPDF(
              'landscape',

              'px',

              [canvas.width, canvas.height]
            );

            pdf.addImage(
              image,

              'PNG',

              0,

              0,

              canvas.width,

              canvas.height
            );

            pdf.save(`${user.login}-certificate.pdf`);
          }
        );
      }
    );
  } catch (error) {
    modalBody.innerHTML = '<p>Failed to load profile</p>';

    console.error(error);
  }
}

// Use global REPO_OWNER and REPO_NAME defined in index.js

let allContributors = [];
let filteredContributors = [];

async function fetchContributors() {
  const contributorsContainer = document.getElementById('contributors');
  const contributorCountSpan = document.getElementById('contributorCount');

  try {
    const response = await fetch(
      `https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}/contributors?per_page=100`
    );

    if (!response.ok) throw new Error('Failed to fetch contributors');

    const contributors = await response.json();
    contributorCountSpan.textContent = contributors.length;

    // Calculate total commits
    const totalCommits = contributors.reduce(
      (sum, c) => sum + c.contributions,
      0
    );
    const totalCommitsEl = document.getElementById('totalCommits');
    if (totalCommitsEl)
      totalCommitsEl.textContent = totalCommits.toLocaleString();

    contributorsContainer.innerHTML = '';

    allContributors = contributors;

    filteredContributors = [...contributors];

    renderContributors(filteredContributors);
  } catch (error) {
    console.error('Error fetching contributors:', error);
    if (contributorsContainer)
      contributorsContainer.innerHTML =
        "<p style='color: #ff4444;'>Failed to load contributors.</p>";
  }
}

function renderContributors(data) {
  const contributorsContainer = document.getElementById('contributors');

  const emptyState = document.getElementById('emptyState');

  contributorsContainer.innerHTML = '';

  if (data.length === 0) {
    emptyState.style.display = 'block';

    return;
  }

  emptyState.style.display = 'none';

  const fragment = document.createDocumentFragment();

  data.forEach((contributor) => {
    const card = document.createElement('div');

    card.className = 'contributor-card';

    card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.login}">

            <h3>${contributor.login}</h3>

            <div class="contributor-stats">

                <div class="stat">

                    <span class="value">
                        ${contributor.contributions}
                    </span>

                    <span class="label">
                        Commits
                    </span>

                </div>

            </div>

           <div class="contributor-links">

    <button
        class="details-btn"
        data-user="${contributor.login}"
    >

        View Details

    </button>

    <a
        href="${contributor.html_url}"
        target="_blank"
        class="github-btn"
    >

        <i class="fab fa-github"></i>
        Profile

    </a>

</div>
        `;

    fragment.appendChild(card);
    const detailsButton = card.querySelector('.details-btn');

    if (detailsButton) {
      detailsButton.addEventListener(
        'click',

        () => {
          openProfile(contributor.login);
        }
      );
    }
  });

  contributorsContainer.appendChild(fragment);
}

async function fetchStargazers() {
  const stargazersContainer = document.getElementById('stargazers');

  try {
    const response = await fetch(
      `https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}/stargazers?per_page=100`
    );

    if (!response.ok) throw new Error('Failed to fetch stargazers');

    const stargazers = await response.json();
    if (stargazersContainer) stargazersContainer.innerHTML = '';

    stargazers.forEach((stargazer) => {
      const starItem = document.createElement('a');
      starItem.href = stargazer.html_url;
      starItem.target = '_blank';
      starItem.className = 'stargazer-item';
      starItem.title = stargazer.login;
      starItem.innerHTML = `<img src="${stargazer.avatar_url}" alt="${stargazer.login}">`;
      if (stargazersContainer) stargazersContainer.appendChild(starItem);
    });
  } catch (error) {
    console.error('Error fetching stargazers:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Repo stats are now handled by index.js
  fetchContributors();
  fetchStargazers();
  const searchInput = document.getElementById('contributorSearch');

  const sortSelect = document.getElementById('sortContributors');
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();

    filteredContributors = allContributors.filter((c) =>
      c.login.toLowerCase().includes(value)
    );

    renderContributors(filteredContributors);
  });

  sortSelect.addEventListener('change', (e) => {
    const order = e.target.value;

    filteredContributors.sort((a, b) => {
      return order === 'asc'
        ? a.contributions - b.contributions
        : b.contributions - a.contributions;
    });

    renderContributors(filteredContributors);
  });
});
