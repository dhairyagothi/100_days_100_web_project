console.log("Email Validator - Final Improved Version");

// ── DOM Elements ──
var submitBtn        = document.getElementById("submitBtn");
var resultCont       = document.getElementById("resultCont");
var usernameInput    = document.getElementById("username");

var suggestionBanner = document.getElementById("suggestionBanner");
var suggestionText   = document.getElementById("suggestionText");
var suggestionBtn    = document.getElementById("suggestionBtn");

var formatErrors     = document.getElementById("formatErrors");
var formatErrorList  = document.getElementById("formatErrorList");

var partBreakdown    = document.getElementById("partBreakdown");
var partLocal        = document.getElementById("partLocal");
var partDomain       = document.getElementById("partDomain");

var exportBtn        = document.getElementById("exportBtn");
var themeToggle      = document.getElementById("themeToggle");

// ── Store last result for export ──
var lastResultData = null;

// ── Known domains ──
var KNOWN_DOMAINS = [
    "gmail.com","yahoo.com","yahoo.in","yahoo.co.in","hotmail.com",
    "outlook.com","outlook.in","rediffmail.com","icloud.com",
    "protonmail.com","zoho.com","aol.com","live.com","msn.com",
    "ymail.com","me.com","mac.com","googlemail.com","pm.me"
];

// ── Typo map ──
var DOMAIN_TYPOS = {
    "gmial.com":"gmail.com","gmai.com":"gmail.com","gamil.com":"gmail.com",
    "gmal.com":"gmail.com","gnail.com":"gmail.com","gmail.con":"gmail.com",
    "gmail.cm":"gmail.com","gmail.cim":"gmail.com","gmaill.com":"gmail.com",

    "yaho.com":"yahoo.com","yahooo.com":"yahoo.com","yahoo.co":"yahoo.com",
    "yhoo.com":"yahoo.com","yahoo.con":"yahoo.com",

    "hotmial.com":"hotmail.com","hotmai.com":"hotmail.com","hotmil.com":"hotmail.com",
    "hotmail.con":"hotmail.com",

    "outlok.com":"outlook.com","outlook.con":"outlook.com",

    "redifmail.com":"rediffmail.com",

    "iclod.com":"icloud.com","icoud.com":"icloud.com",

    "protonmal.com":"protonmail.com"
};

// ── Disposable domains ──
var DISPOSABLE_DOMAINS = [
    "mailinator.com","guerrillamail.com","tempmail.com","10minutemail.com",
    "yopmail.com","trashmail.com","fakeinbox.com","getnada.com"
];

// ── Levenshtein ──
function levenshtein(a, b) {
    var m = a.length, n = b.length;
    var dp = [];

    for (var i = 0; i <= m; i++) {
        dp[i] = [i];
        for (var j = 1; j <= n; j++) {
            if (i === 0) dp[i][j] = j;
            else {
                dp[i][j] = (a[i-1] === b[j-1])
                    ? dp[i-1][j-1]
                    : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
            }
        }
    }
    return dp[m][n];
}

// ── Find closest domain ──
function findClosestDomain(domain) {
    if (DOMAIN_TYPOS[domain]) {
        return { suggestion: DOMAIN_TYPOS[domain], distance: 1 };
    }

    var best = null;
    var bestDist = 999;

    for (var i = 0; i < KNOWN_DOMAINS.length; i++) {
        var known = KNOWN_DOMAINS[i];
        var dist = levenshtein(domain, known);

        var lenDiff = Math.abs(domain.length - known.length);

        if (dist < bestDist && dist <= 3 && lenDiff <= 4) {
            bestDist = dist;
            best = known;
        }
    }

    return best ? { suggestion: best, distance: bestDist } : null;
}

// ── Reset UI ──
function resetFeedback() {
    suggestionBanner.style.display = "none";
    formatErrors.style.display = "none";
    partBreakdown.style.display = "none";
    resultCont.innerHTML = "";
    usernameInput.classList.remove("input-valid", "input-invalid");
    exportBtn.style.display = "none";
}

// ── Format validation ──
function validateFormat(email) {
    var errors = [];
    var atIdx = email.lastIndexOf("@");

    if (atIdx === -1) {
        errors.push("Missing @ symbol");
        return errors;
    }

    var local = email.substring(0, atIdx);
    var domain = email.substring(atIdx + 1);

    if (local.length === 0) errors.push("Empty username");
    if (domain.length === 0) errors.push("Empty domain");

    if (/\s/.test(email)) errors.push("No spaces allowed");
    if (/\.\./.test(email)) errors.push("Consecutive dots not allowed");

    return errors;
}

// ── Score calculator ──
function calculateEmailScore(domain, isKnown, isDisposable, isTypo) {
    var score = 0;

    score += 30; // format passed
    if (isKnown) score += 30;
    if (!isDisposable) score += 20;
    if (!isTypo) score += 20;

    return Math.min(score, 100);
}

// ── Export CSV ──
function exportCSV(data) {
    var csv = "Email,Status,Domain,Score\n";

    csv += [
        data.email,
        data.status,
        data.domain,
        data.score
    ].join(",") + "\n";

    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = "email_result.csv";
    a.click();
}

// ── Main function ──
function handleValidate() {
    var email = usernameInput.value.trim();
    resetFeedback();

    if (!email) {
        showError(["Please enter email"]);
        return;
    }

    var errors = validateFormat(email);

    if (errors.length > 0) {
        showError(errors);
        usernameInput.classList.add("input-invalid");
        return;
    }

    var atIdx = email.lastIndexOf("@");
    var local = email.substring(0, atIdx);
    var domain = email.substring(atIdx + 1).toLowerCase();

    var isKnown = KNOWN_DOMAINS.indexOf(domain) !== -1;
    var isDisposable = DISPOSABLE_DOMAINS.indexOf(domain) !== -1;
    var fuzzy = findClosestDomain(domain);
    var isTypo = !isKnown && fuzzy !== null;

    var score = calculateEmailScore(domain, isKnown, isDisposable, isTypo);

    // suggestion
    if (isTypo) {
        var corrected = local + "@" + fuzzy.suggestion;

        suggestionText.textContent = "Did you mean " + corrected + "?";
        suggestionBanner.style.display = "flex";

        suggestionBtn.onclick = function () {
            usernameInput.value = corrected;
            handleValidate();
        };
    }

    // status
    var status = "Unknown";
    var statusClass = "status-warn";

    if (isDisposable) {
        status = "Disposable Email";
        statusClass = "status-bad";
    } else if (isTypo) {
        status = "Domain Typo";
        statusClass = "status-bad";
    } else if (isKnown) {
        status = "Valid Email";
        statusClass = "status-good";
    }

    // UI result
    resultCont.innerHTML =
        '<div class="result-item"><strong>Email:</strong><span>' + email + '</span></div>' +
        '<div class="result-item"><strong>Status:</strong><span class="' + statusClass + '">' + status + '</span></div>' +
        '<div class="result-item"><strong>Domain:</strong><span>' + domain + '</span></div>' +
        '<div class="result-item"><strong>Score:</strong><span>' + score + '/100</span></div>';

    // store result
    lastResultData = {
        email: email,
        status: status,
        domain: domain,
        score: score
    };

    exportBtn.style.display = "block";

    if (isKnown && !isTypo) {
        usernameInput.classList.add("input-valid");
    } else {
        usernameInput.classList.add("input-invalid");
    }
}

// ── Error UI ──
function showError(errors) {
    formatErrorList.innerHTML = errors.map(e => "<li>" + e + "</li>").join("");
    formatErrors.style.display = "block";
}

// ── Events ──
submitBtn.addEventListener("click", handleValidate);

usernameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleValidate();
});

exportBtn.addEventListener("click", function () {
    if (lastResultData) exportCSV(lastResultData);
});

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light");

    themeToggle.textContent =
        document.body.classList.contains("light")
            ? "🌞 Light"
            : "🌙 Dark";
});