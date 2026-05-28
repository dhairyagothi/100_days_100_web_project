const fs = require("fs");

// Fix style.css
let style = fs.readFileSync("public/Insect-Catch-Game/style.css", "utf8");
style = style.replace(
  /<<<<<<< HEAD[\s\S]*?=======/m,
  `  width: 120px;
  height: 120px;
  filter: drop-shadow(0 0 12px rgba(255,140,0,0.8));
}

.sound-controls {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 100;
}

#mute-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid #fff;
    border-radius: 8px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 1.2rem;
    color: #fff;
}

#mute-btn:hover {
    background: rgba(255, 255, 255, 0.4);
}

#volume-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100px;
    height: 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.4);
    outline: none;
    cursor: pointer;
}

#volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;`,
);
style = style.replace(/>>>>>>> upstream\/main\r?\n/g, "");
// replace the duplicate width/height from the upstream part since we injected it already
style = style.replace(
  `  width: 120px;\n  height: 120px;\n  filter: drop-shadow(0 0 12px rgba(255,140,0,0.8));\n}\n@keyframes`,
  "@keyframes",
);
style = style.replace(
  `  width: 120px;\r\n  height: 120px;\r\n  filter: drop-shadow(0 0 12px rgba(255,140,0,0.8));\r\n}\r\n@keyframes`,
  "@keyframes",
);

fs.writeFileSync("public/Insect-Catch-Game/style.css", style);

// Fix jobs.html
let jobsHtml = fs.readFileSync("public/Job dashboard/jobs.html", "utf8");
jobsHtml = jobsHtml.replace(
  /<div class=\"box\" data-id=\"job2\">[\s\S]*?<div class=\"box\" data-id=\"job6\"><\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  "",
);
fs.writeFileSync("public/Job dashboard/jobs.html", jobsHtml);

// Fix jobs.js
let jobsJs = fs.readFileSync("public/Job dashboard/jobs.js", "utf8");
jobsJs = jobsJs.replace(
  /alert\('Invalid URL!'\);\s*if \(form\) \{/,
  `alert('Invalid URL!');
            }
        });
    });
    if (form) {`,
);
fs.writeFileSync("public/Job dashboard/jobs.js", jobsJs);
