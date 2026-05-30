console.log("Email Validator - Improved version");

// ── DOM elements ──
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

// ── All known valid popular domains ──
var KNOWN_DOMAINS = [
    "gmail.com","yahoo.com","yahoo.in","yahoo.co.in","hotmail.com",
    "outlook.com","outlook.in","rediffmail.com","icloud.com",
    "protonmail.com","zoho.com","aol.com","live.com","msn.com",
    "ymail.com","me.com","mac.com","googlemail.com","pm.me"
];

// ── Exact typo map (common misspellings) ──
var DOMAIN_TYPOS = {
    "gmial.com":"gmail.com","gmai.com":"gmail.com","gamil.com":"gmail.com",
    "gmal.com":"gmail.com","gnail.com":"gmail.com","gmail.co":"gmail.com",
    "gmail.cm":"gmail.com","gmail.con":"gmail.com","gmail.cim":"gmail.com",
    "gmaill.com":"gmail.com","gmailcom":"gmail.com","gmaill.con":"gmail.com",
    "yaho.com":"yahoo.com","yahooo.com":"yahoo.com","yahoo.co":"yahoo.com",
    "yhoo.com":"yahoo.com","yahoo.con":"yahoo.com","yahool.com":"yahoo.com",
    "yahooo.in":"yahoo.in","yaho.in":"yahoo.in",
    "hotmial.com":"hotmail.com","hotmai.com":"hotmail.com","hotmil.com":"hotmail.com",
    "hotmail.co":"hotmail.com","hotmail.cm":"hotmail.com","hotmail.con":"hotmail.com",
    "hotmaill.com":"hotmail.com","homail.com":"hotmail.com",
    "outlok.com":"outlook.com","outloook.com":"outlook.com","outlook.co":"outlook.com",
    "outlook.con":"outlook.com","outllok.com":"outlook.com",
    "rediff.com":"rediffmail.com","redifmail.com":"rediffmail.com",
    "redimail.com":"rediffmail.com","rediffimail.com":"rediffmail.com",
    "redifmail.com":"rediffmail.com","reddifmail.com":"rediffmail.com",
    "iclod.com":"icloud.com","icoud.com":"icloud.com","iclould.com":"icloud.com",
    "protonmal.com":"protonmail.com","protonmial.com":"protonmail.com",
};

// ── Disposable/temp email domains ──
var DISPOSABLE_DOMAINS = [
    "mailinator.com","guerrillamail.com","tempmail.com","10minutemail.com",
    "throwam.com","yopmail.com","sharklasers.com","maildrop.cc",
    "trashmail.com","fakeinbox.com","dispostable.com","spamgourmet.com",
    "temp-mail.org","getnada.com","mailnull.com","spamex.com"
];

// ── Levenshtein distance (measures how similar two strings are) ──
// Returns number of edits needed to turn string a into string b
function levenshtein(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
        dp[i] = [i];
        for (var j = 1; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else {
                dp[i][j] = (a[i-1] === b[j-1])
                    ? dp[i-1][j-1]
                    : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
            }
        }
    }
    return dp[m][n];
}

// ── Find closest known domain using fuzzy matching ──
// Returns { suggestion: "gmail.com", distance: 2 } or null
function findClosestDomain(domain) {
    // First check exact typo map
    if (DOMAIN_TYPOS[domain]) {
        return { suggestion: DOMAIN_TYPOS[domain], distance: 1 };
    }

    var best = null;
    var bestDist = 999;

    for (var i = 0; i < KNOWN_DOMAINS.length; i++) {
        var known = KNOWN_DOMAINS[i];
        var dist  = levenshtein(domain, known);

        // Accept as a "close enough" typo only if:
        // distance <= 3 AND domain length is close (prevents false matches)
        var lenDiff = Math.abs(domain.length - known.length);
        if (dist < bestDist && dist <= 3 && lenDiff <= 4) {
            bestDist = dist;
            best = known;
        }
    }

    // Only suggest if it's clearly a typo (not just any random domain)
    if (best && bestDist <= 3) {
        return { suggestion: best, distance: bestDist };
    }
    return null;
}

// ── Reset all feedback UI ──
function resetFeedback() {
    suggestionBanner.style.display = "none";
    formatErrors.style.display     = "none";
    partBreakdown.style.display    = "none";
    resultCont.innerHTML           = "";
    usernameInput.classList.remove("input-valid", "input-invalid");
}

// ── Client-side format validation ──
function validateFormat(email) {
    var errors = [];
    var atIdx  = email.lastIndexOf("@");

    if (atIdx === -1) {
        errors.push("Missing @ symbol — an email must have exactly one @");
        return errors;
    }
    if (email.indexOf("@") !== atIdx) {
        errors.push("Multiple @ symbols found — only one @ is allowed");
    }

    var local  = email.substring(0, atIdx);
    var domain = email.substring(atIdx + 1);

    if (local.length === 0) {
        errors.push("The part before @ is empty — add your username (e.g. yourname@gmail.com)");
    } else {
        if (local.startsWith("."))
            errors.push("Local part (before @) cannot start with a dot (.)");
        if (local.endsWith("."))
            errors.push("Local part (before @) cannot end with a dot (.)");
        if (/\.\./.test(local))
            errors.push("Consecutive dots (..) are not allowed before the @");
        if (/\s/.test(local))
            errors.push("Spaces are not allowed in the email address");
        if (/[^a-zA-Z0-9._%+\-]/.test(local))
            errors.push("Local part contains an invalid character — only letters, numbers, and . _ % + - are allowed");
    }

    if (domain.length === 0) {
        errors.push("The part after @ is empty — add a domain like gmail.com");
    } else {
        if (!domain.includes("."))
            errors.push("Domain is missing a dot — it should look like gmail.com or yahoo.in");
        if (domain.startsWith(".") || domain.endsWith("."))
            errors.push("Domain cannot start or end with a dot (.)");
        if (domain.startsWith("-") || domain.endsWith("-"))
            errors.push("Domain cannot start or end with a hyphen (-)");
        if (/\.\./.test(domain))
            errors.push("Consecutive dots (..) are not allowed in the domain");
        if (/\s/.test(domain))
            errors.push("Spaces are not allowed in the domain");
        if (/[^a-zA-Z0-9.\-]/.test(domain))
            errors.push("Domain contains an invalid character — only letters, numbers, dots, and hyphens are allowed");
        var tld = domain.split(".").pop();
        if (tld && tld.length < 2)
            errors.push("Top-level domain (." + tld + ") is too short — use .com, .in, .org etc.");
    }

    return errors;
}

// ── Show format error list ──
function showFormatErrors(errors) {
    formatErrorList.innerHTML = errors.map(function(e) {
        return "<li>" + e + "</li>";
    }).join("");
    formatErrors.style.display = "block";
}

// ── Show part breakdown badges ──
function showPartBreakdown(email, domainIsTypo) {
    var atIdx  = email.lastIndexOf("@");
    if (atIdx === -1) return;

    var local  = email.substring(0, atIdx);
    var domain = email.substring(atIdx + 1);

    var localBad  = /[^a-zA-Z0-9._%+\-]|^\.|\.$/g.test(local) || /\.\./.test(local) || /\s/.test(local) || local.length === 0;
    var domainBad = !domain.includes(".") || /\s/.test(domain) || domain.length === 0 || domainIsTypo;

    partLocal.textContent  = local  || "(empty)";
    partDomain.textContent = domain || "(empty)";
    partLocal.className    = "part-badge " + (localBad  ? "err" : "ok");
    partDomain.className   = "part-badge " + (domainBad ? "err" : "ok");
    partBreakdown.style.display = "flex";
}

// ── Main validate function ──
function handleValidate() {
    var email = usernameInput.value.trim();
    resetFeedback();

    if (email === "") {
        usernameInput.classList.add("input-invalid");
        showFormatErrors(["Please enter an email address"]);
        return;
    }

    // Format validation first
    var errors = validateFormat(email);
    if (errors.length > 0) {
        usernameInput.classList.add("input-invalid");
        if (email.includes("@")) showPartBreakdown(email, false);
        showFormatErrors(errors);
        return;
    }

    // Format is structurally OK — now check domain quality
    var atIdx  = email.lastIndexOf("@");
    var local  = email.substring(0, atIdx);
    var domain = email.substring(atIdx + 1).toLowerCase();

    var isDisposable   = DISPOSABLE_DOMAINS.indexOf(domain) !== -1;
    var isKnown        = KNOWN_DOMAINS.indexOf(domain) !== -1;
    var fuzzy          = findClosestDomain(domain);
    var isDomainTypo   = !isKnown && fuzzy !== null;

    // Show part badges — mark domain red if it's a typo
    showPartBreakdown(email, isDomainTypo);

    // Show suggestion banner if domain looks like a typo
    if (isDomainTypo) {
        var corrected = local + "@" + fuzzy.suggestion;
        suggestionText.textContent = "Did you mean " + corrected + "?";
        suggestionBanner.style.display = "flex";
        suggestionBtn.onclick = function() {
            usernameInput.value = corrected;
            suggestionBanner.style.display = "none";
            handleValidate();
        };
    }

    // Decide overall status
    var isFree   = KNOWN_DOMAINS.indexOf(domain) !== -1;
    var status, reason, statusClass;

    if (isDisposable) {
        status      = "❌ Invalid — Disposable Email";
        reason      = "This is a temporary/throwaway email address and is not accepted in most services";
        statusClass = "status-bad";
    } else if (isDomainTypo) {
        status      = "❌ Invalid — Domain Looks Like a Typo";
        reason      = "The domain \"" + domain + "\" does not exist or is not a recognised email provider. Did you mean " + fuzzy.suggestion + "?";
        statusClass = "status-bad";
    } else if (isKnown) {
        status      = "✅ Likely Valid";
        reason      = "Recognised email provider with valid format";
        statusClass = "status-good";
    } else {
        // Unknown domain — could be a company/org domain, treat as uncertain
        status      = "⚠️ Unrecognised Domain";
        reason      = "The domain \"" + domain + "\" is not a known email provider. It may be valid (company/org domain) but could not be verified";
        statusClass = "status-warn";
    }

    // Build result cards
    var html = "";
    html += '<div class="result-item"><strong>Email:</strong><span>' + email + '</span></div>';
    html += '<div class="result-item"><strong>Status:</strong><span class="' + statusClass + '">' + status + '</span></div>';
    html += '<div class="result-item"><strong>Domain:</strong><span>' + domain + '</span></div>';
    html += '<div class="result-item"><strong>Format Valid:</strong><span>✅ Yes</span></div>';
    html += '<div class="result-item"><strong>Free Email:</strong><span>' + (isFree ? "Yes" : "No") + '</span></div>';
    html += '<div class="result-item"><strong>Disposable:</strong><span>' + (isDisposable ? "⚠️ Yes — temporary email" : "✅ No") + '</span></div>';
    html += '<div class="result-item"><strong>Domain Known:</strong><span>' + (isKnown ? "✅ Yes" : (isDomainTypo ? "❌ Looks like a typo" : "⚠️ Unknown (may be org domain)")) + '</span></div>';
    html += '<div class="result-item"><strong>Reason:</strong><span>' + reason + '</span></div>';

    resultCont.innerHTML = html;

    if (isDomainTypo || isDisposable) {
        usernameInput.classList.add("input-invalid");
    } else {
        usernameInput.classList.add("input-valid");
    }
}

// ── Button click ──
submitBtn.addEventListener("click", function(e) {
    e.preventDefault();
    handleValidate();
});

// ── Enter key ──
usernameInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") handleValidate();
});