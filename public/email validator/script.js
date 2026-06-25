console.log("Email Validator - Final Improved Version");

var submitBtn = document.getElementById("submitBtn");
var resultCont = document.getElementById("resultCont");
var validationTimestamp = document.getElementById("validationTimestamp");
var copyReportBtn = document.getElementById("copyReportBtn");
var downloadTxtBtn = document.getElementById("downloadTxtBtn");
var usernameInput = document.getElementById("username");

var suggestionBanner = document.getElementById("suggestionBanner");
var suggestionText = document.getElementById("suggestionText");
var suggestionBtn = document.getElementById("suggestionBtn");

var formatErrors = document.getElementById("formatErrors");
var formatErrorList = document.getElementById("formatErrorList");

var partBreakdown = document.getElementById("partBreakdown");
var partLocal = document.getElementById("partLocal");
var partDomain = document.getElementById("partDomain");
var themeToggle = document.getElementById("themeToggle");

var reportText = "";
var lastResultData = null;

var KNOWN_DOMAINS = [
    "gmail.com", "yahoo.com", "yahoo.in", "yahoo.co.in", "hotmail.com",
    "outlook.com", "outlook.in", "rediffmail.com", "icloud.com",
    "protonmail.com", "zoho.com", "aol.com", "live.com", "msn.com",
    "ymail.com", "me.com", "mac.com", "googlemail.com", "pm.me"
];

var FREE_DOMAINS = [
    "gmail.com", "yahoo.com", "yahoo.in", "yahoo.co.in", "hotmail.com",
    "outlook.com", "outlook.in", "rediffmail.com", "icloud.com",
    "protonmail.com", "zoho.com", "aol.com", "live.com", "msn.com",
    "ymail.com", "me.com", "mac.com", "googlemail.com", "pm.me"
];

var DOMAIN_TYPOS = {
    "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com",
    "gmal.com": "gmail.com", "gnail.com": "gmail.com", "gmail.con": "gmail.com",
    "gmail.cm": "gmail.com", "gmail.cim": "gmail.com", "gmaill.com": "gmail.com",
    "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com",
    "yhoo.com": "yahoo.com", "yahoo.con": "yahoo.com",
    "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmil.com": "hotmail.com",
    "hotmail.con": "hotmail.com",
    "outlok.com": "outlook.com", "outlook.con": "outlook.com",
    "redifmail.com": "rediffmail.com",
    "iclod.com": "icloud.com", "icoud.com": "icloud.com",
    "protonmal.com": "protonmail.com"
};

var DISPOSABLE_DOMAINS = [
    "mailinator.com", "guerrillamail.com", "tempmail.com", "10minutemail.com",
    "yopmail.com", "trashmail.com", "fakeinbox.com", "getnada.com"
];

function levenshtein(a, b) {
    var m = a.length;
    var n = b.length;
    var dp = [];

    for (var i = 0; i <= m; i++) {
        dp[i] = [i];
        for (var j = 1; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else {
                dp[i][j] = (a[i - 1] === b[j - 1])
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[m][n];
}

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

function resetFeedback() {
    suggestionBanner.style.display = "none";
    formatErrors.style.display = "none";
    partBreakdown.style.display = "none";
    resultCont.innerHTML = "";
    validationTimestamp.style.display = "none";
    copyReportBtn.style.display = "none";
    downloadTxtBtn.style.display = "none";
    reportText = "";
    lastResultData = null;
    usernameInput.classList.remove("input-valid", "input-invalid");
}

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
    if (domain && domain.indexOf(".") === -1) errors.push("Domain must include an extension");

    return errors;
}

function calculateEmailScore(isKnown, isDisposable, isTypo) {
    var score = 30;

    if (isKnown) score += 30;
    if (!isDisposable) score += 20;
    if (!isTypo) score += 20;

    return Math.min(score, 100);
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

function showPartBreakdown(local, domain) {
    partLocal.textContent = local;
    partDomain.textContent = domain;
    partLocal.className = "part-badge " + (local ? "ok" : "err");
    partDomain.className = "part-badge " + (domain ? "ok" : "err");
    partBreakdown.style.display = "flex";
}

function getReason(isKnown, isDisposable, isTypo) {
    if (isDisposable) return "Domain is commonly used for temporary email addresses.";
    if (isTypo) return "Domain looks like a typo for a popular email provider.";
    if (isKnown) return "Domain matches a known email provider.";
    return "Format is valid, but the domain is not in the known-provider list.";
}

function buildReport(data) {
    return [
        "Email Validation Report",
        "Email: " + data.email,
        "Status: " + data.status,
        "Domain: " + data.domain,
        "Score: " + data.score + "/100",
        "Format Valid: Yes",
        "Free Email: " + (data.isFree ? "Yes" : "No"),
        "Disposable: " + (data.isDisposable ? "Yes - temporary email" : "No"),
        "Domain Known: " + (data.isKnown ? "Yes" : (data.isTypo ? "Looks like a typo" : "Unknown")),
        "Reason: " + data.reason,
        "Validated on: " + data.validatedAt
    ].join("\n");
}

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
    var normalizedEmail = local + "@" + domain;

    showPartBreakdown(local, domain);

    var isKnown = KNOWN_DOMAINS.indexOf(domain) !== -1;
    var isFree = FREE_DOMAINS.indexOf(domain) !== -1;
    var isDisposable = DISPOSABLE_DOMAINS.indexOf(domain) !== -1;
    var fuzzy = findClosestDomain(domain);
    var isTypo = !isKnown && fuzzy !== null;
    var score = calculateEmailScore(isKnown, isDisposable, isTypo);

    if (isTypo) {
        var corrected = local + "@" + fuzzy.suggestion;

        suggestionText.textContent = "Did you mean " + corrected + "?";
        suggestionBanner.style.display = "flex";
        suggestionBtn.onclick = function () {
            usernameInput.value = corrected;
            handleValidate();
        };
    }

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

    var reason = getReason(isKnown, isDisposable, isTypo);
    var formattedDate = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

    resultCont.innerHTML =
        '<div class="result-item"><strong>Email:</strong><span>' + escapeHtml(normalizedEmail) + '</span></div>' +
        '<div class="result-item"><strong>Status:</strong><span class="' + statusClass + '">' + status + '</span></div>' +
        '<div class="result-item"><strong>Domain:</strong><span>' + escapeHtml(domain) + '</span></div>' +
        '<div class="result-item"><strong>Score:</strong><span>' + score + '/100</span></div>' +
        '<div class="result-item"><strong>Reason:</strong><span>' + escapeHtml(reason) + '</span></div>';

    lastResultData = {
        email: normalizedEmail,
        status: status,
        domain: domain,
        score: score,
        isFree: isFree,
        isDisposable: isDisposable,
        isKnown: isKnown,
        isTypo: isTypo,
        reason: reason,
        validatedAt: formattedDate
    };

    reportText = buildReport(lastResultData);
    validationTimestamp.textContent = "Validated on: " + formattedDate;
    validationTimestamp.style.display = "block";
    copyReportBtn.style.display = "block";
    downloadTxtBtn.style.display = "block";

    usernameInput.classList.add((isKnown && !isTypo && !isDisposable) ? "input-valid" : "input-invalid");
}

function showError(errors) {
    formatErrorList.innerHTML = errors.map(function (error) {
        return "<li>" + escapeHtml(error) + "</li>";
    }).join("");
    formatErrors.style.display = "block";
}

submitBtn.addEventListener("click", handleValidate);

usernameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleValidate();
});

copyReportBtn.addEventListener("click", function () {
    if (!reportText) return;

    navigator.clipboard.writeText(reportText).then(function () {
        copyReportBtn.textContent = "Copied!";
        setTimeout(function () {
            copyReportBtn.textContent = "Copy Report";
        }, 2000);
    });
});

downloadTxtBtn.addEventListener("click", function () {
    if (!reportText) return;

    var blob = new Blob([reportText], { type: "text/plain" });
    var link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "email_validation_report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
});

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "Light" : "Dark";
});
