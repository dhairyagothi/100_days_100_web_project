document.addEventListener('DOMContentLoaded', () => {
    const EcoRules = [
        {
            id: 'unthrottled-scroll',
            label: 'Unthrottled Scroll Event',
            description: 'Scroll events fire rapidly. Using them without a "throttle" wrapper wastes CPU/Battery energy.',
            regex: /\.addEventListener\s*\(\s*['"](scroll|resize)['"]\s*,\s*(?![^)]*throttle|[^)]*debounce)/g,
            severity: 'high',
            deduction: 20
        },
        {
            id: 'heavy-box-shadow',
            label: 'High-Blur Box Shadow',
            description: 'Blurs > 20px force the GPU to work harder on every frame, increasing power consumption.',
            regex: /box-shadow\s*:\s*[^;]*\d{2,}px[^;]*\d{2,}px/g,
            severity: 'medium',
            deduction: 10
        },
        {
            id: 'forced-sync-layout',
            label: 'Forced Layout Repaint',
            description: 'Reading offsetHeight/Width forces the browser to recalculate the layout instantly, causing a performance spike.',
            regex: /\.(offsetHeight|offsetWidth|scrollHeight|scrollWidth|getComputedStyle)/g,
            severity: 'low',
            deduction: 5
        }
    ];

    const inputArea = document.getElementById('code-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const scoreDisplay = document.getElementById('score-text');
    const gaugeCircle = document.getElementById('eco-gauge');
    const sizeDisplay = document.getElementById('size-val');
    const carbonDisplay = document.getElementById('carbon-val');
    const issuesContainer = document.getElementById('issues-list');

    const requiredElements = [
    inputArea,
    analyzeBtn,
    scoreDisplay,
    gaugeCircle,
    sizeDisplay,
    carbonDisplay,
    issuesContainer];
    
    if (requiredElements.some(el => !el)) {
    console.error("❌ Required DOM elements are missing.");
    return;
}


function animateValue(start, end, duration, element, suffix = "", decimals = 2) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = progress * (end - start) + start;
            
            element.textContent = current.toFixed(decimals) + suffix;
            
            if (element === scoreDisplay) {
                updateGaugeVisuals(current);
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateGaugeVisuals(currentScore) {
        let color = '#00e676'; // Eco Green
        if (currentScore < 50) color = '#ff1744'; // Danger Red
        else if (currentScore < 80) color = '#ffd600'; // Warning Yellow
        
        gaugeCircle.style.background = `conic-gradient(${color} ${currentScore}%, #30363d 0)`;
    }

    function runAnalysis() {
        const code = inputArea.value;

        if (!code.trim()) {
            alert("Please paste some code first!");
            return;
        }

        let targetScore = 100;
        let detectedIssues = [];

        const bytes = new Blob([code]).size;
        const targetKb = bytes / 1024;
        
        // Sustainability Math: 0.2g CO2 per GB (approximate network model)
        // Scaled to 10,000 views to ensure visibility
        const targetCarbon = (targetKb / (1024 * 1024)) * 0.2 * 1000 * 10000;

        for (const rule of EcoRules) {
            const regex = new RegExp(rule.regex.source, rule.regex.flags);
            const matches = code.match(regex);
            if (!matches) continue;
            const matchCount = matches.length;
            targetScore -= rule.deduction * matchCount;
            detectedIssues.push({
                title: rule.label,
                desc: rule.description,
                level: rule.severity,
                count: matchCount
            });
        }

        const finalScore = Math.max(0, targetScore);

        const currentScore = Number.parseFloat(scoreDisplay.textContent) || 0;
        const currentKb = Number.parseFloat(sizeDisplay.textContent) || 0;
        const currentCarbon = Number.parseFloat(carbonDisplay.textContent) || 0;

        animateValue(currentScore, finalScore, 1000, scoreDisplay, "", 0);
        animateValue(currentKb, targetKb, 1000, sizeDisplay, " KB", 2);
        animateValue(currentCarbon, targetCarbon, 1000, carbonDisplay, " mg", 2);

        updateIssuesUI(detectedIssues);
    }

    function updateIssuesUI(issues) {
        issuesContainer.innerHTML = '';

        if (issues.length === 0) {
            issuesContainer.innerHTML = '<p class="empty-state">☘️ Your code is energy-efficient!</p>';
        } else {
            issues.forEach((issue, index) => {
                const card = document.createElement('div');
                card.className = `issue-card ${issue.level}`;
                
                card.style.opacity = "0";
                card.style.transform = "translateY(15px)";
                card.style.transition = `all 0.4s ease ${index * 0.15}s`;
                
                card.innerHTML = `
                    <div class="issue-title">
                        <span>${issue.title}</span>
                        <span class="count-badge">${issue.count} found</span>
                    </div>
                    <p class="issue-desc">${issue.desc}</p>
                `;
                
                issuesContainer.appendChild(card);
                
                requestAnimationFrame(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                });
            });
        }
    }

    if (analyzeBtn) {analyzeBtn.addEventListener('click', runAnalysis);}
    
    console.log("EcoLint Engine Ready!");
});