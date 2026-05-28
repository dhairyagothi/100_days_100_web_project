function analyzeSMS() {
  let text = document.getElementById("smsInput").value.toLowerCase();

  if (!text.trim()) {
    document.getElementById("result").innerText = "⚠️ Please enter a message";
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
    { k: "lottery", w: 3, t: "Scam reward bait" }
  ];

  rules.forEach(r => {
    if (text.includes(r.k)) {
      score += r.w;
      tags.push(r.t);
    }
  });

  // normalize score
  let risk = Math.min((score / 12) * 100, 100);

  // UI updates
  document.getElementById("score").innerText =
    `Risk Score: ${Math.round(risk)}%`;

  document.getElementById("tags").innerText =
    tags.length ? "Detected: " + tags.join(" • ") : "No suspicious patterns detected";

  let bar = document.getElementById("bar");
  bar.style.width = risk + "%";

  let result = document.getElementById("result");

  if (risk > 70) {
    result.innerText = "🚨 High Risk Scam";
    bar.style.background = "#ef4444";
  } else if (risk > 40) {
    result.innerText = "⚠️ Suspicious Message";
    bar.style.background = "#facc15";
  } else {
    result.innerText = "✅ Safe Message";
    bar.style.background = "#22c55e";
  }
}