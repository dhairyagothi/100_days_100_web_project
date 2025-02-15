const REPO_OWNER = "dhairyagothi";
const REPO_NAME = "100_days_100_web_project";
const GITHUB_TOKEN = ""; // Optional: Add GitHub personal access token

async function fetchContributors() {
  const contributorsContainer = document.getElementById("contributors");

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`,
      {
        headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
      }
    );

    if (!response.ok) throw new Error("Failed to fetch contributors");

    const contributors = await response.json();

    contributors.forEach((contributor) => {
      const card = document.createElement("div");
      card.className = "contributor-card";

      const img = document.createElement("img");
      img.src = contributor.avatar_url;
      img.alt = contributor.login;

      const name = document.createElement("h3");
      name.textContent = contributor.login;

      const githubLink = document.createElement("a");
      githubLink.href = contributor.html_url;
      githubLink.target = "_blank";
      githubLink.textContent = "GitHub Profile";

      const button = document.createElement("button");
      button.textContent = "Certificate";
      button.addEventListener("click", () => {
        openCertificatePage(contributor.login, contributor.avatar_url);
      });

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(githubLink);
      card.appendChild(button);
      contributorsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching contributors:", error);
    contributorsContainer.innerHTML =
      "<p style='color: red;'>Failed to load contributors.</p>";
  }
}

function openCertificatePage(username, avatarUrl) {
  const certWindow = window.open("", "_blank");

  certWindow.document.write(`
    <html>
      <head>
        <title>Certificate of Contribution</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
            padding: 20px;
          }
          h1 {
            color: #5a4637;
          }
          img {
            border: 10px solid #d4af37;
            border-radius: 12px;
            margin-top: 20px;
            max-width: 100%;
            height: auto;
          }
          .download-btn {
            margin-top: 30px;
            padding: 15px 30px;
            background-color: #f2c94c;
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
          .download-btn:hover {
            background-color: #d4af37;
          }
        </style>
      </head>
      <body>
        <h1>Certificate of Contribution</h1>
        <canvas id="certificateCanvas" width="1600" height="1000"></canvas>
        <br />
        <button class="download-btn" onclick="downloadCertificate()">Download Certificate</button>
        <script>
          function generateCertificate() {
            const canvas = document.getElementById("certificateCanvas");
            const ctx = canvas.getContext("2d");

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "#f7e8a1");
            gradient.addColorStop(1, "#f2c94c");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Decorative border
            ctx.strokeStyle = "#d4af37";
            ctx.lineWidth = 20;
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

            // Title
            ctx.fillStyle = "#5a4637";
            ctx.font = "bold 80px Georgia";
            ctx.textAlign = "center";
            ctx.fillText("Certificate of Contribution", canvas.width / 2, 150);

            // GitHub image
            const image = new Image();
            image.crossOrigin = "Anonymous";
            image.src = "${avatarUrl}";
            image.onload = () => {
              const imageSize = 200;
              ctx.save();
              ctx.beginPath();
              ctx.arc(canvas.width / 2, 300, imageSize / 2, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(image, canvas.width / 2 - imageSize / 2, 200, imageSize, imageSize);
              ctx.restore();

              // Username
              ctx.font = "bold 50px Arial";
              ctx.fillStyle = "#5a4637";
              ctx.fillText("${username}", canvas.width / 2, 500);

              // Certificate details
              ctx.font = "35px Arial";
              ctx.fillText("This certificate is proudly presented to", canvas.width / 2, 580);
              ctx.fillText("${username} for his/her valuable", canvas.width / 2, 630);
              ctx.fillText("contribution to 100_DAYS_100_WEB_PROJECTS.", canvas.width / 2, 680);
              ctx.fillText("Keep contributing. Best wishes", canvas.width / 2, 730);
              ctx.fillText("for your future endeavors.", canvas.width / 2, 780);

              // Signature
              ctx.font = "italic 30px Georgia";
              ctx.fillText("Dhairya Gothi", canvas.width / 1.5, 850);
              ctx.strokeStyle = "#5a4637";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(canvas.width / 1.5 - 150, 860);
              ctx.lineTo(canvas.width / 1.5 + 150, 860);
              ctx.stroke();

              // Date
              const date = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
              ctx.font = "25px Arial";
              ctx.fillText("Generated on: " + date, canvas.width / 5, 900);
            };
          }

          function downloadCertificate() {
            const canvas = document.getElementById("certificateCanvas");
            const link = document.createElement("a");
            link.download = "${username}_certificate.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
          }

          generateCertificate();
        </script>
      </body>
    </html>
  `);
}

// Fetch contributors when the page loads
fetchContributors();
