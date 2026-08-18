const templates = {
  1: "URGENT: Your bank account is locked due to suspicious activity. Verify your identity immediately at http://129.48.21.90/login to prevent permanent suspension.",
  2: "CONGRATULATIONS! You have been selected as the grand prize winner of $10,000! Click here to claim your cash reward: bit.ly/win-prize-now",
  3: "Your security OTP code for the transaction of ₹12,500.00 is 493021. Do NOT share this code with anyone.",
  4: "Hey! Are you still down to watch a movie tonight? Let me know, I'm heading out in 15 minutes."
};

function useTemplate(id) {
  const input = document.getElementById("smsInput");
  input.value = templates[id];
  updateCounters();
  analyzeSMS();
}

function updateCounters() {
  const text = document.getElementById("smsInput").value;
  document.getElementById("charCount").innerText = text.length;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("smsInput");
  if (input) {
    input.addEventListener("input", updateCounters);
  }
});

function analyzeSMS() {
  const textInput = document.getElementById("smsInput").value;
  const text = textInput.toLowerCase();

  if (!textInput.trim()) {
    document.getElementById("result").innerText = "⚠️ Please enter a message";
    document.getElementById("score").innerText = "";
    document.getElementById("tags").innerText = "";
    document.getElementById("bar").style.width = "0%";
    return;
  }

  let score = 0;
  let tags = [];

  const rules = [
    { k: "otp", w: 3, t: "OTP request" },
    { k: "urgent", w: 2, t: "Urgency tactic" },
    { k: "immediately", w: 2, t: "Pressure language" },
    { k: "bank", w: 2, t: "Bank impersonation" },
    { k: "account", w: 2, t: "Account reference" },
    { k: "password", w: 3, t: "Sensitive data request" },
    { k: "pin", w: 3, t: "PIN request" },
    { k: "click", w: 2, t: "Suspicious link prompt" },
    { k: "verify", w: 2, t: "Fake verification attempt" },
    { k: "lottery", w: 3, t: "Scam reward bait" },
    { k: "refund", w: 2, t: "Fake refund notification" }
  ];

  rules.forEach(r => {
    if (text.includes(r.k)) {
      score += r.w;
      tags.push(r.t);
    }
  });

  // Advanced Regex checks for Phishing Signals
  if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(text)) {
    score += 3;
    tags.push("Raw IP Address link");
  }
  if (text.includes("http://")) {
    score += 2;
    tags.push("Non-secure link (http)");
  }
  if (/\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd)\b/.test(text)) {
    score += 3;
    tags.push("Short link domain");
  }
  if (/\b(www\.|https?:\/\/|\.com\/|\.xyz\/|\.net\/|\.top\/|\.work\/)/.test(text)) {
    // Only count basic URL presence if not already flagged as short link or IP
    if (!tags.includes("Short link domain") && !tags.includes("Raw IP Address link")) {
      score += 1;
      tags.push("URL / Link presence");
    }
  }

  // normalize score
  // normalize score
let risk = Math.min((score / 14) * 100, 100);

// Build explanation
let explanation = [];

if (tags.includes("Urgency tactic")) {
  explanation.push(
    "This message uses urgency-based language to pressure the recipient into acting quickly."
  );
}

if (tags.includes("Suspicious link prompt") || tags.includes("URL / Link presence")) {
  explanation.push(
    "The message contains a link, which is a common technique used in phishing and scam campaigns."
  );
}

if (tags.includes("Bank impersonation")) {
  explanation.push(
    "The message references banking-related terms that are frequently used in financial phishing attacks."
  );
}

if (tags.includes("Fake verification attempt")) {
  explanation.push(
    "Requests to verify account information are often used to steal credentials."
  );
}

if (!explanation.length) {
  explanation.push(
    "No major scam indicators were detected based on the current analysis rules."
  );
}
  // UI updates
  document.getElementById("score").innerText =
    `Risk Score: ${Math.round(risk)}%`;

  document.getElementById("tags").innerText =
    tags.length ? "Detected: " + tags.join(" • ") : "No suspicious patterns detected";

  document.getElementById("analysis").innerText =
  "Analysis: " + explanation.join(" ");

  let bar = document.getElementById("bar");
  bar.style.width = risk + "%";

  let result = document.getElementById("result");

  if (risk > 65) {
    result.innerText = "🚨 High Risk Scam";
    bar.style.background = "#ef4444";
  } else if (risk > 30) {
    result.innerText = "⚠️ Suspicious Message";
    bar.style.background = "#facc15";
  } else {
    result.innerText = "✅ Safe Message";
    bar.style.background = "#22c55e";
  }
}