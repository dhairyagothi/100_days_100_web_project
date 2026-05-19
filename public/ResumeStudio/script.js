document.addEventListener("DOMContentLoaded", () => {
    const resumePreview = document.getElementById("resumePreview");
    const previewBtn    = document.getElementById("previewBtn");
    const downloadBtn   = document.getElementById("downloadBtn");
    const errorMsg      = document.getElementById("errorMsg");
    const templateBtn1  = document.getElementById("templateBtn1");
    const templateBtn2  = document.getElementById("templateBtn2");
    const templateBtn3  = document.getElementById("templateBtn3");
    const templateBtn4  = document.getElementById("templateBtn4");
    const templateBtn5  = document.getElementById("templateBtn5");
    const templateBtn6  = document.getElementById("templateBtn6");

    function attachCharCounter(inputId, countId) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(countId);
        input.addEventListener("input", () => {
            counter.textContent = `${input.value.length}/${input.maxLength}`;
            if (input.value.length >= input.maxLength) {
                counter.style.color = "red";
            } else {
                counter.style.color = "";
            }
        });
    }
    attachCharCounter("name", "nameCount");
    attachCharCounter("email", "emailCount");
    attachCharCounter("phone", "phoneCount");
    attachCharCounter("education", "educationCount");
    attachCharCounter("summary", "summaryCount");
    attachCharCounter("projects", "projectsCount");
    attachCharCounter("skills", "skillsCount");
    attachCharCounter("experience", "experienceCount");
    function validateFields() {
        const fields = ["name", "email", "phone", "education", "summary", "projects", "skills", "experience"];
        for (const id of fields) {
            if (!document.getElementById(id).value.trim()) {
                return false;
            }
        }
        return true;
    }
    function buildPreview1() {
        const name       = document.getElementById("name").value;
        const email      = document.getElementById("email").value;
        const phone      = document.getElementById("phone").value;
        const education  = document.getElementById("education").value;
        const summary    = document.getElementById("summary").value;
        const projects   = document.getElementById("projects").value;
        const skills     = document.getElementById("skills").value;
        const experience = document.getElementById("experience").value;
return `
<div id="resume-v1">
            <h3>${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <h4>Education</h4>
            <p>${education}</p>
            <h4>Summary</h4>
            <p>${summary}</p>
            <h4>Projects</h4>
            <p>${projects}</p>
            <h4>Skills</h4>
            <ul>${skills.split(",").map(s => `<li>${s.trim()}</li>`).join("")}</ul>
            <h4>Experience</h4>
            <p>${experience}</p>
</div>        `;
    }
function buildPreview2() {

    const name       = document.getElementById("name").value;
    const email      = document.getElementById("email").value;
    const phone      = document.getElementById("phone").value;
    const education  = document.getElementById("education").value;
    const summary    = document.getElementById("summary").value;
    const projects   = document.getElementById("projects").value;
    const skills     = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;
    return `

    <style>
        /* MAIN RESUME */
        .resume {
            width: 800px;
            min-height: 1100px; 
            height: auto; 
            display: flex;
            background: #ffffff;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            margin: 20px auto;
        }

        /* LEFT SIDE - Sidebar */
        .left {
            width: 32%;
            background: #1b263b; 
            padding: 40px 25px;
            color: #ffffff; 
            word-wrap: break-word; 
        }

        .left-section {
            margin-bottom: 35px;
        }

        .left-section h3 {
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #ffffff; 
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        }

        .left-section p {
            font-size: 13px;
            line-height: 1.6;
            color: #ffffff !important; /* Crystal White */
            margin-bottom: 12px;
        }

        .left-section strong {
            color: #ffffff;
            display: block;
            margin-bottom: 2px;
        }

        .left-section ul {
            padding-left: 15px;
            list-style-type: none;
        }

        .left-section li {
            font-size: 13px;
            line-height: 1.8;
            margin-bottom: 5px;
            color: #ffffff !important; /* Crystal White for Skills */
        }

        /* List markers for skills */
        .left-section li::before {
            content: "•";
            color: #ffffff; /* Bright white bullets */
            font-weight: bold;
            display: inline-block; 
            width: 1em;
            margin-left: -1em;
        }

        /* RIGHT SIDE - Main Content */
        .right {
            width: 68%;
            background: white;
            padding: 50px 45px;
            word-wrap: break-word;
        }

        .name-header {
            margin-bottom: 40px;
            border-left: 8px solid #1b263b;
            padding-left: 20px;
        }

        .name-header h1 {
            font-size: 40px;
            text-transform: uppercase;
            color: #0d1b2a;
            margin: 0;
            font-weight: 800;
        }

        .section {
            margin-bottom: 35px;
        }

        .section h3 {
            font-size: 20px;
            color: #1b263b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .section h3::after {
            content: "";
            flex: 1;
            margin-left: 15px;
            height: 1px;
            background: #dcdcdc;
        }

        .section p {
            font-size: 14px;
            line-height: 1.7;
            color: #415a77;
            white-space: pre-wrap; 
        }

    </style>

<div class="resume" id="resume-v2">
        <div class="left">

            <div class="left-section">
                <h3>Contact</h3>
                <p><strong>Email</strong>${email}</p>
                <p><strong>Phone</strong>${phone}</p>
            </div>

            <div class="left-section">
                <h3>Skills</h3>
                <ul>
                    ${skills
                        .split(",")
                        .map(skill => `<li>${skill.trim()}</li>`)
                        .join("")}
                </ul>
            </div>
        </div>

        <div class="right">
            <div class="name-header">
                <h1>${name}</h1>
            </div>

            <div class="section">
                <h3>Profile</h3>
                <p>${summary}</p>
            </div>

            <div class="section">
                <h3>Projects</h3>
                <p>${projects}</p>
            </div>

            <div class="section">
                <h3>Experience</h3>
                <p>${experience}</p>
            </div>

            <div class="section">
                <h3>Education</h3>
                <p>${education}</p>
            </div>
        </div>
    </div>
    `;
}


function buildPreview3() {
    const name       = document.getElementById("name").value;
    const email      = document.getElementById("email").value;
    const phone      = document.getElementById("phone").value;
    const education  = document.getElementById("education").value;
    const summary    = document.getElementById("summary").value;
    const projects   = document.getElementById("projects").value;
    const skills     = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;

    return `
    <style>
        /* MAIN RESUME CONTAINER */
        .resume-container {
            width: 800px;
            min-height: 1100px;
            height: auto;
            background: #ffffff;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin: 20px auto;
            padding: 60px 55px;
            box-sizing: border-box;
            color: #333333;
            overflow-wrap: break-word; /* Prevents overflow from text strings */
        }

        /* HEADER SECTION */
        .resume-header {
            border-bottom: 2px solid #2b3d52;
            padding-bottom: 15px;
            margin-bottom: 30px;
            position: relative;
        }

        .resume-header h1 {
            font-size: 42px;
            font-weight: 700;
            color: #2b3d52;
            text-transform: uppercase;
            margin: 0 0 10px 0;
            letter-spacing: 0.5px;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .contact-row {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #555555;
            flex-wrap: wrap;
        }

        .contact-item {
            display: flex;
            align-items: center;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .contact-item:not(:last-child)::after {
            content: "•";
            margin-left: 20px;
            color: #4b6b94;
            font-weight: bold;
        }

        .contact-item strong {
            color: #2b3d52;
            margin-right: 5px;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }

        /* TIMELINE & SECTION LAYOUT */
        .resume-section {
            margin-bottom: 35px;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .resume-section h4 {
            font-size: 18px;
            color: #4b6b94;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 15px 0;
            font-weight: 600;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }

        .resume-section p {
            font-size: 14px;
            line-height: 1.7;
            color: #444444;
            margin: 0;
            white-space: pre-wrap; /* Preserves manual line breaks */
            overflow-wrap: break-word;
            word-break: break-word;
            hyphens: auto;
        }

        /* TIMELINE STYLING FOR WRAPPED TEXT BLOCKS */
        .timeline-block {
            position: relative;
            padding-left: 20px;
            border-left: 3px solid #4b6b94;
            margin-top: 10px;
        }

        .timeline-block::before {
            content: "▪";
            position: absolute;
            left: -6px;
            top: -2px;
            background: white;
            color: #2b3d52;
            font-size: 16px;
            height: 14px;
            line-height: 12px;
        }

        /* GRID SKILLS LIST */
        .skills-grid {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        .skills-grid li {
            font-size: 14px;
            color: #444444;
            display: flex;
            align-items: center;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .skills-grid li::before {
            content: "▪";
            color: #4b6b94;
            font-size: 12px;
            margin-right: 10px;
            flex-shrink: 0;
        }
    </style>

<div class="resume-container" id="resume-v3">
        <div class="resume-header">
            <h1>${name}</h1>
            <div class="contact-row">
                <div class="contact-item"><strong>Email</strong> ${email}</div>
                <div class="contact-item"><strong>Phone</strong> ${phone}</div>
            </div>
        </div>

        <div class="resume-section">
            <h4>Professional Summary</h4>
            <p>${summary}</p>
        </div>

        <div class="resume-section">
            <h4>Experience</h4>
            <div class="timeline-block">
                <p>${experience}</p>
            </div>
        </div>

        <div class="resume-section">
            <h4>Key Projects</h4>
            <div class="timeline-block">
                <p>${projects}</p>
            </div>
        </div>

        <div class="resume-section">
            <h4>Education</h4>
            <div class="timeline-block">
                <p>${education}</p>
            </div>
        </div>

        <div class="resume-section">
            <h4>Skills</h4>
            <ul class="skills-grid">
                ${skills
                    .split(",")
                    .map(s => `<li>${s.trim()}</li>`)
                    .join("")}
            </ul>
        </div>
    </div>
    `;
}
function buildPreview4() {
    const name       = document.getElementById("name").value;
    const email      = document.getElementById("email").value;
    const phone      = document.getElementById("phone").value;
    const education  = document.getElementById("education").value;
    const summary    = document.getElementById("summary").value;
    const projects   = document.getElementById("projects").value;
    const skills     = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;

    return `
    <style>
        /* MAIN CONTAINMENT */
        .resume-wrapper {
            width: 800px;
            min-height: 1100px;
            height: auto;
            background: #ffffff;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin: 20px auto;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
        }

        /* BLUE TOP HEADER BLOCK */
        .top-banner {
            background: #00407a; /* Signature Deep Blue */
            padding: 35px 40px;
            color: #ffffff;
        }

        .top-banner h1 {
            font-size: 38px;
            font-weight: 700;
            margin: 0 0 5px 0;
            letter-spacing: 0.5px;
        }

        /* BODY LAYOUT SPLIT */
        .resume-body {
            display: flex;
            flex: 1;
        }

        /* MAIN COLUMN (LEFT SIDE) */
        .main-column {
            width: 65%;
            padding: 30px 35px 40px 40px;
            box-sizing: border-box;
        }

        /* SIDEBAR COLUMN (RIGHT SIDE) */
        .sidebar-column {
            width: 35%;
            background: #f4f5f7; /* Very Light Muted Gray Background */
            padding: 30px 30px 40px 30px;
            box-sizing: border-box;
            border-left: 1px solid #e2e8f0;
        }

        /* TYPOGRAPHY & SECTIONS */
        .content-section {
            margin-bottom: 30px;
            word-wrap: break-word;
        }

        .content-section h4 {
            font-size: 18px;
            color: #00407a;
            font-weight: 700;
            margin: 0 0 12px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #d1d5db;
        }

        .sidebar-section h4 {
            font-size: 16px;
            color: #00407a;
            font-weight: 700;
            margin: 0 0 15px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #d1d5db;
            text-transform: none;
        }

        /* TEXT AND PARAGRAPHS */
        .content-section p {
            font-size: 13.5px;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            white-space: pre-wrap;
        }

        .meta-group {
            margin-bottom: 15px;
        }

        .meta-group strong {
            display: block;
            font-size: 13px;
            color: #444444;
            margin-bottom: 3px;
        }

        .meta-group p {
            font-size: 13px;
            color: #555555;
            margin: 0;
            word-break: break-all;
        }

        /* SIDEBAR SKILLS LIST (LEFT ALIGNED WITH PRECISE SPACING) */
        .sidebar-skills {
            list-style: none;
            padding: 0;
            margin: 0;
            text-align: left;
        }

        .sidebar-skills li {
            font-size: 13.5px;
            color: #444444;
            margin-bottom: 8px;
            line-height: 1.5;
            position: relative;
            padding-left: 18px; /* Room for the square marker */
            word-wrap: break-word;
        }

        .sidebar-skills li::before {
            content: "▪";
            color: #00407a;
            font-size: 12px;
            position: absolute;
            left: 0;
            top: 0;
        }
    </style>

<div class="resume-wrapper" id="resume-v4">
        <div class="top-banner">
            <h1>${name}</h1>
        </div>

        <div class="resume-body">
            
            <div class="main-column">
                <div class="content-section">
                    <h4>Summary</h4>
                    <p>${summary}</p>
                </div>

                <div class="content-section">
                    <h4>Projects</h4>
                    <p>${projects}</p>
                </div>

                <div class="content-section">
                    <h4>Experience</h4>
                    <p>${experience}</p>
                </div>

                <div class="content-section">
                    <h4>Education</h4>
                    <p>${education}</p>
                </div>
            </div>

            <div class="sidebar-column">
                <div class="sidebar-section" style="margin-bottom: 35px;">
                    <h4>Personal Info</h4>
                    
                    <div class="meta-group">
                        <strong>Phone</strong>
                        <p>${phone}</p>
                    </div>

                    <div class="meta-group">
                        <strong>E-mail</strong>
                        <p>${email}</p>
                    </div>
                </div>

                <div class="sidebar-section">
                    <h4>Key Skills</h4>
                    <ul class="sidebar-skills">
                        ${skills
                            .split(",")
                            .map(s => `<li>${s.trim()}</li>`)
                            .join("")}
                    </ul>
                </div>
            </div>

        </div>
    </div>
    `;
}
function buildPreview5() {
    const name       = document.getElementById("name").value;
    const email      = document.getElementById("email").value;
    const phone      = document.getElementById("phone").value;
    const education  = document.getElementById("education").value;
    const summary    = document.getElementById("summary").value;
    const projects   = document.getElementById("projects").value;
    const skills     = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;

    // Grab first letters for the initials monogram bubble
    const initials = name ? name.split(" ").map(n => n[0]).join("").toLowerCase().slice(0, 2) : "me";

    return `
    <style>
        /* MAIN CONTAINMENT */
        .resume-container-v5 {
            width: 800px;
            min-height: 1100px;
            height: auto;
            background: #ffffff;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin: 20px auto;
            display: flex;
            padding: 50px 40px;
            box-sizing: border-box;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        /* LEFT SIDEBAR COLUMN */
        .sidebar-v5 {
            width: 30%;
            padding-right: 30px;
            box-sizing: border-box;
            flex-shrink: 0;
            min-width: 0; 
        }

        /* RIGHT MAIN CONTENT AREA */
        .main-content-v5 {
            width: 70%;
            padding-left: 10px;
            box-sizing: border-box;
            flex-shrink: 0;
            min-width: 0; 
        }

        /* SECTION TITLES WITH DOT PREFIX */
        .section-title-v5 {
            font-size: 18px;
            color: #00407a; /* Target Deep Blue */
            font-weight: 700;
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .section-title-v5::before {
            content: "•";
            margin-right: 8px;
            font-size: 22px;
            color: #00407a;
            line-height: 0;
            flex-shrink: 0;
        }

        /* SIDEBAR INFO GROUPS */
        .sidebar-group-v5 {
            margin-bottom: 35px;
        }

        .info-item-v5 {
            font-size: 13.5px;
            color: #444444;
            margin-bottom: 12px;
            line-height: 1.4;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .info-item-v5 strong {
            display: block;
            color: #333333;
            margin-bottom: 2px;
        }

        .skills-list-v5 {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .skills-list-v5 li {
            font-size: 13.5px;
            color: #444444;
            margin-bottom: 8px;
            line-height: 1.5;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        /* HEADER WRAPPER (RIGHT SIDE) */
        .header-block-v5 {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 35px;
            min-width: 0;
        }

        /* THE CIRCULAR LOGO BUBBLE */
        .avatar-circle-v5 {
            width: 85px;
            height: 85px;
            background: #00407a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 32px;
            flex-shrink: 0;
        }

        .name-titles-v5 {
            min-width: 0; 
        }

        .name-titles-v5 h1 {
            font-size: 36px;
            color: #00407a;
            margin: 0 0 4px 0;
            font-weight: 700;
            letter-spacing: -0.5px;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        /* BODY PARAGRAPHS */
        .body-block-v5 {
            margin-bottom: 30px;
            overflow-wrap: break-word;
            word-break: break-word;
        }

        .body-block-v5 p {
            font-size: 13.5px;
            line-height: 1.6;
            color: #444444;
            margin: 0;
            white-space: pre-wrap; 
            overflow-wrap: break-word;
            word-break: break-word;
        }
    </style>

<div class="resume-container-v5" id="resume-v5">
        
        <div class="sidebar-v5">
            <div class="sidebar-group-v5">
                <h4 class="section-title-v5">Personal Info</h4>
                <div class="info-item-v5">
                    <strong>Email</strong>
                    ${email}
                </div>
                <div class="info-item-v5">
                    <strong>Phone</strong>
                    ${phone}
                </div>
            </div>

            <div class="sidebar-group-v5">
                <h4 class="section-title-v5">Skills</h4>
                <ul class="skills-list-v5">
                    ${skills
                        .split(",")
                        .map(s => `<li>${s.trim()}</li>`)
                        .join("")}
                </ul>
            </div>
        </div>

        <div class="main-content-v5">
            
            <div class="header-block-v5">
                <div class="avatar-circle-v5">${initials}</div>
                <div class="name-titles-v5">
                    <h1>${name}</h1>
                </div>
            </div>

            <div class="body-block-v5" style="margin-bottom: 35px;">
                <h4 class="section-title-v5">Summary</h4>
                <p>${summary}</p>
            </div>

            <div class="body-block-v5">
                <h4 class="section-title-v5">Projects</h4>
                <p>${projects}</p>
            </div>

            <div class="body-block-v5">
                <h4 class="section-title-v5">Experience</h4>
                <p>${experience}</p>
            </div>

            <div class="body-block-v5">
                <h4 class="section-title-v5">Education</h4>
                <p>${education}</p>
            </div>

        </div>

    </div>
    `;
}
function buildPreview6() {

    const name       = document.getElementById("name").value;
    const email      = document.getElementById("email").value;
    const phone      = document.getElementById("phone").value;
    const education  = document.getElementById("education").value;
    const summary    = document.getElementById("summary").value;
    const projects   = document.getElementById("projects").value;
    const skills     = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;

    return `

    <style>

        .resume-container-v6{
            width:800px;
            min-height:1100px;
            height:auto;
            background:#ffffff;
            font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            box-shadow:0 10px 30px rgba(0,0,0,0.1);
            margin:20px auto;
            padding:60px 55px;
            box-sizing:border-box;
            color:#333333;
            position:relative;
            overflow:hidden;
        }

        .bg-pattern{
            position:absolute;
            top:0;
            right:-100px;
            width:450px;
            height:100%;
            pointer-events:none;
            opacity:0.12;
            z-index:1;
            display:flex;
            flex-direction:column;
            gap:40px;
            padding-top:50px;
        }

        .bg-pill{
            width:380px;
            height:110px;
            border-radius:60px;
            align-self:flex-end;
        }

        .bg-pill:nth-child(4n+1){
            background:#fca311;
            transform:translateX(40px);
        }

        .bg-pill:nth-child(4n+2){
            background:#00407a;
            width:440px;
        }

        .bg-pill:nth-child(4n+3){
            background:#e63946;
            transform:translateX(80px);
        }

        .bg-pill:nth-child(4n+4){
            background:#a8dadc;
            width:320px;
        }

        .resume-content-v6{
            position:relative;
            z-index:2;
            width:100%;
        }

        .header-v6{
            margin-bottom:30px;
        }

        .header-v6 h1{
            font-size:44px;
            font-weight:800;
            color:#2b3d52;
            text-transform:uppercase;
            margin:0 0 15px 0;
            letter-spacing:0.5px;
        }

        .meta-row-v6{
            display:flex;
            gap:30px;
            font-size:13.5px;
            color:#555555;
            border-bottom:2px solid #2b3d52;
            padding-bottom:15px;
        }

        .meta-item-v6 strong{
            color:#2b3d52;
            font-size:11px;
            text-transform:uppercase;
            letter-spacing:1px;
            display:block;
            margin-bottom:2px;
        }

        .section-v6{
            margin-top:30px;
            word-wrap:break-word;
        }

        .section-v6 h4{
            font-size:16px;
            color:#4b6b94;
            text-transform:uppercase;
            letter-spacing:1px;
            margin:0 0 15px 0;
            font-weight:700;
        }

        .section-v6 p{
            font-size:13.5px;
            line-height:1.65;
            color:#222222;
            margin:0;
            white-space:pre-wrap;
        }

        .timeline-v6{
            position:relative;
            padding-left:25px;
            border-left:3px solid #4b6b94;
            margin-left:5px;
            margin-top:10px;
        }

        .timeline-v6::before{
            content:"▪";
            position:absolute;
            left:-6px;
            top:-3px;
            background:#ffffff;
            color:#2b3d52;
            font-size:16px;
            height:14px;
            line-height:11px;
        }

        .skills-list-v6{
            list-style:none;
            padding:0;
            margin:0;
        }

        .skills-list-v6 li{
            font-size:13.5px;
            color:#222222;
            margin-bottom:8px;
            display:flex;
            align-items:center;
        }

        .skills-list-v6 li::before{
            content:"▪";
            color:#4b6b94;
            font-size:12px;
            margin-right:12px;
        }

    </style>

    <div class="resume-container-v6" id="resume-v6">

        <div class="bg-pattern">
            <div class="bg-pill"></div>
            <div class="bg-pill"></div>
            <div class="bg-pill"></div>
            <div class="bg-pill"></div>
            <div class="bg-pill"></div>
            <div class="bg-pill"></div>
            <div class="bg-pill"></div>
            <div class="bg-pill"></div>
        </div>

        <div class="resume-content-v6">

            <div class="header-v6">

                <h1>${name}</h1>

                <div class="meta-row-v6">

                    <div class="meta-item-v6">
                        <strong>Email</strong>
                        ${email}
                    </div>

                    <div class="meta-item-v6">
                        <strong>Phone</strong>
                        ${phone}
                    </div>

                </div>

            </div>

            <div class="section-v6">
                <h4>Summary</h4>
                <p>${summary}</p>
            </div>

            <div class="section-v6">
                <h4>Projects</h4>

                <div class="timeline-v6">
                    <p>${projects}</p>
                </div>
            </div>

            <div class="section-v6">
                <h4>Experience</h4>

                <div class="timeline-v6">
                    <p>${experience}</p>
                </div>
            </div>

            <div class="section-v6">
                <h4>Education</h4>

                <div class="timeline-v6">
                    <p>${education}</p>
                </div>
            </div>

            <div class="section-v6">

                <h4>Skills</h4>

                <ul class="skills-list-v6">
                    ${skills
                        .split(",")
                        .map(s => `<li>${s.trim()}</li>`)
                        .join("")}
                </ul>

            </div>

        </div>

    </div>

    `;
}




async function downloadResume(resumeId, fileName) {

    const element = document.getElementById(resumeId);

    if (!element) {
        alert("Please generate the template first.");
        return;
    }

    await document.fonts.ready;

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
    );

    pdf.save(fileName);
}

document.getElementById("dTemplateBtn1").onclick = function () {
    downloadResume("resume-v1", "resume-template-1.pdf");
};

document.getElementById("dTemplateBtn2").onclick = function () {
    downloadResume("resume-v2", "resume-template-2.pdf");
};

document.getElementById("dTemplateBtn3").onclick = function () {
    downloadResume("resume-v3", "resume-template-3.pdf");
};

document.getElementById("dTemplateBtn4").onclick = function () {
    downloadResume("resume-v4", "resume-template-4.pdf");
};

document.getElementById("dTemplateBtn5").onclick = function () {
    downloadResume("resume-v5", "resume-template-5.pdf");
};

document.getElementById("dTemplateBtn6").onclick = function () {
    downloadResume("resume-v6", "resume-template-6.pdf");
};


    previewBtn.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000); //by default, it will show template 1
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview1();
    });
    






    templateBtn1.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000); //by default, it will show template 1
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview1();

    });
        templateBtn2.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000); //by default, it will show template 1
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview2();

    });
        templateBtn3.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000); //by default, it will show template 1
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview3();

    });
        templateBtn4.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000); //by default, it will show template 1
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview4();

    });
        templateBtn5.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000); //by default, it will show template 1
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview5();

    });
        templateBtn6.addEventListener("click", () => {
        if (!validateFields()) {
            errorMsg.style.display = "block";
            setTimeout(() => errorMsg.style.display = "none", 3000); //by default, it will show template 1
            return;
        }
        errorMsg.style.display = "none";
        resumePreview.innerHTML = buildPreview6();

    });
});