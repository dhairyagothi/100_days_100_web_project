/**
 * Main Template Compilation Engine. Evaluates configurations 
 * to parse a self-contained web string module containing tab routers and blurs.
 */
function compilePortfolioHTML() {
    const name = document.getElementById('input-name').value;
    const title = document.getElementById('input-title').value;
    const bio = document.getElementById('input-bio').value;
    const email = document.getElementById('input-email').value;
    const phrasesStr = document.getElementById('input-phrases').value;
    const theme = themeSelect.value;

    // Split raw text arrays into compiled JSON string arrays safe for code insertion
    const jsonPhrases = JSON.stringify(phrasesStr.split(',').map(p => p.trim()));

    let themeColors = "";
    if (theme === 'cyber-punk') {
        themeColors = `--p-glow: #ff007f; --s-glow: #00f2fe; --card-border: rgba(255,0,127,0.15);`;
    } else {
        themeColors = `--p-glow: #7928ca; --s-glow: #ffcc00; --card-border: rgba(121,40,202,0.15);`;
    }

    // Accumulate project loops markup nodes
    let projectCardsHTML = "";
    projectDataList.forEach(proj => {
        projectCardsHTML += `
        <div class="card">
            <h3>${proj.title}</h3>
            <div class="tech-tag">${proj.tech}</div>
            <p>${proj.desc}</p>
        </div>`;
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Portfolio</title>
    <style>
        :root {
            ${themeColors}
            --bg-color: #06060c;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }
        body { font-family: system-ui, sans-serif; background: var(--bg-color); color: var(--text-main); margin: 0; padding: 0; overflow-x: hidden; line-height: 1.6; }
        
        /* Kinetic Atmospheric Background Blobs */
        .blob { position: fixed; width: 400px; height: 400px; border-radius: 50%; filter: blur(130px); opacity: 0.25; z-index: -1; animation: float 8s infinite alternate ease-in-out; }
        .b1 { background: var(--p-glow); top: -100px; left: -100px; }
        .b2 { background: var(--s-glow); bottom: -100px; right: -100px; animation-delay: -4s; }
        
        @keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(40px, 40px) scale(1.15); } }

        .navbar { position: fixed; top: 0; width: 100%; display: flex; justify-content: space-between; padding: 24px 6%; box-sizing: border-box; z-index: 100; backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .brand { font-weight: 800; font-size: 1.2rem; letter-spacing: -0.5px; background: linear-gradient(to right, var(--p-glow), var(--s-glow)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-menu { display: flex; gap: 24px; }
        .nav-link { cursor: pointer; color: var(--text-muted); font-size: 0.95rem; font-weight: 600; transition: color 0.3s; position: relative; }
        .nav-link.active, .nav-link:hover { color: var(--text-main); }
        .nav-link.active::after { content:''; position:absolute; bottom:-6px; left:0; width:100%; height:2px; background: var(--p-glow); border-radius:2px; }

        .page-view { display: none; padding: 140px 6% 60px 6%; max-width: 800px; margin: 0 auto; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .page-view.active { display: block; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; line-height: 1.1; margin: 0 0 16px 0; }
        .gradient-txt { background: linear-gradient(135deg, var(--p-glow), var(--s-glow)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .typing-box { font-size: 1.5rem; font-weight: 700; color: var(--s-glow); margin-bottom: 24px; }
        #type-hook { border-right: 2px solid var(--s-glow); padding-right: 4px; animation: blink 0.8s infinite; }
        @keyframes blink { 50% { border-color: transparent; } }

        .bio { font-size: 1.15rem; color: var(--text-muted); max-width: 600px; }
        
        /* Vibrant Neomorphic Glassmorphism Interface Panels */
        .card { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--card-border); padding: 26px; border-radius: 14px; margin-bottom: 24px; backdrop-filter: blur(8px); transition: transform 0.3s, border-color 0.3s; }
        .card:hover { transform: translateY(-4px); border-color: var(--s-glow); }
        .card h3 { margin: 0 0 8px 0; font-size: 1.35rem; }
        .tech-tag { display: inline-block; font-size: 0.75rem; font-weight: 700; background: rgba(255,255,255,0.05); color: var(--s-glow); padding: 4px 12px; border-radius: 20px; margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.05); }
        
        .btn-glow { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, var(--p-glow), var(--s-glow)); color: #000; font-weight: 700; text-decoration: none; border-radius: 30px; box-shadow: 0 0 15px rgba(255,255,255,0.1); transition: transform 0.2s; }
        .btn-glow:hover { transform: scale(1.03); }
    </style>
</head>
<body>

    <div class="blob b1"></div>
    <div class="blob b2"></div>

   <nav class="navbar">
    <div class="brand">${name}</div>
    <div class="nav-menu">
        <span class="nav-link active" onclick="navigate('home', this)">Home</span>
        <span class="nav-link" onclick="navigate('work', this)">Work</span>
        <span class="nav-link" onclick="navigate('contact', this)">Contact</span>
    </div>
</nav>

    <section id="view-home" class="page-view active">
        <h1>Hey, I'm <br><span class="gradient-txt">${name}</span></h1>
        <div class="typing-box">I specialize in <span id="type-hook"></span></div>
        <p class="bio">${bio}</p>
    </section>

    <section id="view-work" class="page-view">
        <h2 style="font-size:2rem; margin-bottom:30px;">Engineering Stack</h2>
        <div style="margin-top:20px;">${projectCardsHTML || '<p>No projects configured yet.</p>'}</div>
    </section>

    <section id="view-contact" class="page-view">
        <h2 style="font-size:2rem; margin-bottom:15px;">Get In Touch</h2>
        <p style="color:var(--text-muted); margin-bottom:30px;">Drop a line to lock in software engineering availability blocks.</p>
        <a href="mailto:${email}" class="btn-glow">Send Message 🚀</a>
    </section>

    <script>
       function navigate(id, element) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const targetView = document.getElementById('view-' + id);

    if (targetView) {
        targetView.classList.add('active');
    }

    if (element) {
        element.classList.add('active');
    }
}

        const phrases = ${jsonPhrases};
        let pIdx = 0, cIdx = 0, del = false;
        const hook = document.getElementById('type-hook');

        function engine() {
            const str = phrases[pIdx];
            hook.textContent = del ? str.substring(0, cIdx - 1) : str.substring(0, cIdx + 1);
            cIdx = del ? cIdx - 1 : cIdx + 1;
            let time = del ? 40 : 80;
            if(!del && cIdx === str.length) { time = 2000; del = true; }
            else if(del && cIdx === 0) { del = false; pIdx = (pIdx + 1) % phrases.length; time = 400; }
            setTimeout(engine, time);
        }
        document.addEventListener('DOMContentLoaded', engine);
    </script>
</body>
</html>`;
}
