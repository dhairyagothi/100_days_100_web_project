/* ============================================================
   PRIVACY POLICY GENERATOR — Complete JS
   ============================================================ */
'use strict';

// ── Constants ──────────────────────────────────────────────────
const STORAGE_KEY  = 'ppg_form_data';
const SETTINGS_KEY = 'ppg_settings';

const SECTION_KEYS = [
  'dataCollection','personalInfo','thirdParty','analytics','cookies',
  'logData','location','camera','notifications','payment',
  'children','gdpr','ccpa','retention','security',
  'userRights','links','changes','contact'
];

const TEMPLATES = {
  basic: {
    sections: ['dataCollection','personalInfo','security','userRights','contact','changes'],
    label: 'Basic'
  },
  standard: {
    sections: ['dataCollection','personalInfo','thirdParty','analytics','cookies',
               'children','security','userRights','links','changes','contact'],
    label: 'Standard'
  },
  full: {
    sections: SECTION_KEYS,
    label: 'Full'
  },
  gdpr: {
    sections: ['dataCollection','personalInfo','thirdParty','analytics','cookies',
               'logData','location','camera','notifications','payment',
               'children','gdpr','ccpa','retention','security',
               'userRights','links','changes','contact'],
    label: 'GDPR Ready'
  }
};

const TP_SERVICES = {
  'tp-ga':        { name: 'Google Analytics', url: 'https://policies.google.com/privacy', desc: 'analytics and performance tracking' },
  'tp-firebase':  { name: 'Firebase',         url: 'https://firebase.google.com/support/privacy', desc: 'backend services and analytics' },
  'tp-admob':     { name: 'Google AdMob',     url: 'https://support.google.com/admob/answer/6128543', desc: 'mobile advertising' },
  'tp-facebook':  { name: 'Facebook Ads',     url: 'https://www.facebook.com/policy.php', desc: 'social media advertising' },
  'tp-twitter':   { name: 'Twitter',          url: 'https://twitter.com/en/privacy', desc: 'social media integration' },
  'tp-linkedin':  { name: 'LinkedIn',         url: 'https://www.linkedin.com/legal/privacy-policy', desc: 'professional network integration' },
  'tp-stripe':    { name: 'Stripe',           url: 'https://stripe.com/privacy', desc: 'payment processing' },
  'tp-paypal':    { name: 'PayPal',           url: 'https://www.paypal.com/privacy', desc: 'payment processing' },
  'tp-razorpay':  { name: 'Razorpay',         url: 'https://razorpay.com/privacy/', desc: 'payment processing' },
  'tp-aws':       { name: 'Amazon Web Services', url: 'https://aws.amazon.com/privacy/', desc: 'cloud infrastructure' },
  'tp-cloudinary':{ name: 'Cloudinary',       url: 'https://cloudinary.com/privacy', desc: 'media storage and management' },
  'tp-twilio':    { name: 'Twilio',           url: 'https://www.twilio.com/legal/privacy', desc: 'communication services' },
  'tp-mixpanel':  { name: 'Mixpanel',         url: 'https://mixpanel.com/legal/privacy-policy', desc: 'product analytics' },
  'tp-sentry':    { name: 'Sentry',           url: 'https://sentry.io/privacy/', desc: 'error tracking and monitoring' },
  'tp-intercom':  { name: 'Intercom',         url: 'https://www.intercom.com/legal/privacy', desc: 'customer support and messaging' }
};

// ── State ──────────────────────────────────────────────────────
let settings    = { theme: 'dark' };
let previewMode = 'formatted';
let currentTemplate = 'standard';

// ── DOM ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadSettings();
  applyTheme();
  setDefaultDate();
  loadSavedForm();
  bindEvents();
  generatePolicy();
}

// ── Storage ────────────────────────────────────────────────────
function loadSettings() {
  try { settings = { theme:'dark', ...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}') }; } catch(e) {}
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

function saveForm() {
  const data = {
    appName:         $('appName').value,
    companyName:     $('companyName').value,
    appType:         $('appType').value,
    lastUpdated:     $('lastUpdated').value,
    websiteUrl:      $('websiteUrl').value,
    contactEmail:    $('contactEmail').value,
    physicalAddress: $('physicalAddress').value,
    sections: SECTION_KEYS.reduce((o,k) => { o[k] = $(`sec-${k}`)?.checked; return o; }, {}),
    thirdParty: Object.keys(TP_SERVICES).reduce((o,k) => { o[k] = $(k)?.checked; return o; }, {})
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedForm() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if(!saved) return;
    if(saved.appName)         $('appName').value         = saved.appName;
    if(saved.companyName)     $('companyName').value     = saved.companyName;
    if(saved.appType)         $('appType').value         = saved.appType;
    if(saved.lastUpdated)     $('lastUpdated').value     = saved.lastUpdated;
    if(saved.websiteUrl)      $('websiteUrl').value      = saved.websiteUrl;
    if(saved.contactEmail)    $('contactEmail').value    = saved.contactEmail;
    if(saved.physicalAddress) $('physicalAddress').value = saved.physicalAddress;
    if(saved.sections) {
      SECTION_KEYS.forEach(k => {
        const el = $(`sec-${k}`);
        if(el && saved.sections[k] !== undefined) {
          el.checked = saved.sections[k];
          el.closest('.section-toggle')?.classList.toggle('active', saved.sections[k]);
        }
      });
    }
    if(saved.thirdParty) {
      Object.keys(TP_SERVICES).forEach(k => {
        const el = $(k);
        if(el && saved.thirdParty[k] !== undefined) el.checked = saved.thirdParty[k];
      });
    }
  } catch(e) {}
}

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  $('themeToggle').querySelector('i').className =
    settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}
function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveSettings();
}

// ── Default Date ───────────────────────────────────────────────
function setDefaultDate() {
  $('lastUpdated').value = new Date().toISOString().split('T')[0];
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  $('themeToggle').addEventListener('click', toggleTheme);
  $('copyBtn').addEventListener('click', copyPolicy);
  $('resetBtn').addEventListener('click', resetForm);

  // Live update on input change
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(el => {
    el.addEventListener('change', () => { saveForm(); generatePolicy(); });
    el.addEventListener('input',  () => { saveForm(); generatePolicy(); });
  });

  // Section toggles
  SECTION_KEYS.forEach(k => {
    const el = $(`sec-${k}`);
    if(el) {
      el.addEventListener('change', () => {
        el.closest('.section-toggle')?.classList.toggle('active', el.checked);
        saveForm(); generatePolicy();
      });
    }
  });

  // Select all / none
  $('selectAll').addEventListener('click', () => {
    SECTION_KEYS.forEach(k => {
      const el = $(`sec-${k}`);
      if(el) { el.checked = true; el.closest('.section-toggle')?.classList.add('active'); }
    });
    saveForm(); generatePolicy();
  });
  $('selectNone').addEventListener('click', () => {
    SECTION_KEYS.forEach(k => {
      const el = $(`sec-${k}`);
      if(el) { el.checked = false; el.closest('.section-toggle')?.classList.remove('active'); }
    });
    saveForm(); generatePolicy();
  });

  // Templates
  document.querySelectorAll('.template-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.template-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyTemplate(tab.dataset.template);
    });
  });

  // Preview mode
  $('previewRaw').addEventListener('click', () => {
    previewMode = 'raw';
    $('previewRaw').classList.add('active');
    $('previewFormatted').classList.remove('active');
    generatePolicy();
  });
  $('previewFormatted').addEventListener('click', () => {
    previewMode = 'formatted';
    $('previewFormatted').classList.add('active');
    $('previewRaw').classList.remove('active');
    generatePolicy();
  });

  // Export
  $('exportTxt').addEventListener('click',  () => exportPolicy('txt'));
  $('exportHtml').addEventListener('click', () => exportPolicy('html'));
  $('exportMd').addEventListener('click',   () => exportPolicy('md'));
  $('copyPolicy').addEventListener('click', copyPolicy);
}

// ── Apply Template ─────────────────────────────────────────────
function applyTemplate(tmpl) {
  currentTemplate = tmpl;
  const template  = TEMPLATES[tmpl];
  if(!template) return;

  SECTION_KEYS.forEach(k => {
    const el = $(`sec-${k}`);
    if(el) {
      const isOn = template.sections.includes(k);
      el.checked = isOn;
      el.closest('.section-toggle')?.classList.toggle('active', isOn);
    }
  });
  saveForm(); generatePolicy();
  showToast(`${template.label} template applied!`, 'success');
}

// ── Get Form Data ──────────────────────────────────────────────
function getFormData() {
  return {
    appName:         $('appName').value.trim()         || '[App Name]',
    companyName:     $('companyName').value.trim()     || '[Company Name]',
    appType:         $('appType').value,
    lastUpdated:     $('lastUpdated').value            || new Date().toISOString().split('T')[0],
    websiteUrl:      $('websiteUrl').value.trim()      || '[Website URL]',
    contactEmail:    $('contactEmail').value.trim()    || '[Contact Email]',
    physicalAddress: $('physicalAddress').value.trim(),
    sections:        SECTION_KEYS.reduce((o,k) => { o[k] = $(`sec-${k}`)?.checked || false; return o; }, {}),
    thirdParty:      Object.keys(TP_SERVICES).filter(k => $(k)?.checked)
  };
}

// ── Generate Policy ────────────────────────────────────────────
function generatePolicy() {
  const data     = getFormData();
  const sections = data.sections;
  const tpList   = data.thirdParty.map(k => TP_SERVICES[k]);
  const date     = new Date(data.lastUpdated).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

  let policy = '';

  // Header
  policy += `PRIVACY POLICY\n\n`;
  policy += `${data.appName}\n`;
  policy += `Last Updated: ${date}\n\n`;
  policy += `This Privacy Policy describes how ${data.companyName} ("we", "us", or "our") `;
  policy += `collects, uses, and shares information about you when you use our ${getAppTypeLabel(data.appType)} `;
  policy += `${data.appName} ("the App").\n\n`;

  // Sections
  if(sections.dataCollection) {
    policy += `INFORMATION WE COLLECT\n\n`;
    policy += `We collect information you provide directly to us, such as when you create an account, `;
    policy += `use our services, or contact us for support. This may include:\n\n`;
    policy += `• Name and email address\n`;
    policy += `• Username and password\n`;
    policy += `• Profile information\n`;
    policy += `• Usage data and preferences\n`;
    policy += `• Device information and identifiers\n`;
    policy += `• IP address and browser type\n\n`;
  }

  if(sections.personalInfo) {
    policy += `HOW WE USE YOUR INFORMATION\n\n`;
    policy += `We use the information we collect to:\n\n`;
    policy += `• Provide, maintain, and improve our services\n`;
    policy += `• Process transactions and send related information\n`;
    policy += `• Send technical notices and support messages\n`;
    policy += `• Respond to your comments and questions\n`;
    policy += `• Monitor and analyze usage patterns and trends\n`;
    policy += `• Personalize and improve your experience\n\n`;
  }

  if(sections.thirdParty && tpList.length > 0) {
    policy += `THIRD-PARTY SERVICES\n\n`;
    policy += `We use the following third-party services that may collect information:\n\n`;
    tpList.forEach(tp => {
      policy += `• ${tp.name} — Used for ${tp.desc}. Privacy Policy: ${tp.url}\n`;
    });
    policy += `\nThese third parties have their own privacy policies governing the use of such information.\n\n`;
  }

  if(sections.analytics) {
    policy += `ANALYTICS AND TRACKING\n\n`;
    policy += `We use analytics tools to help us understand how users interact with our ${getAppTypeLabel(data.appType)}. `;
    policy += `These tools collect information such as how often you use the App, the features you use, `;
    policy += `and performance metrics. We use this data to improve the App and your experience.\n\n`;
  }

  if(sections.cookies) {
    policy += `COOKIES AND SIMILAR TECHNOLOGIES\n\n`;
    policy += `We use cookies and similar tracking technologies to track activity on our service and store `;
    policy += `certain information. You can instruct your browser to refuse all cookies or to indicate when `;
    policy += `a cookie is being sent. However, if you do not accept cookies, some portions of our service `;
    policy += `may not function properly.\n\n`;
    policy += `Types of cookies we use:\n`;
    policy += `• Session cookies — to operate our service\n`;
    policy += `• Preference cookies — to remember your preferences\n`;
    policy += `• Security cookies — for security purposes\n\n`;
  }

  if(sections.logData) {
    policy += `LOG DATA\n\n`;
    policy += `We collect log data that your device sends whenever you use our ${getAppTypeLabel(data.appType)}. `;
    policy += `This log data may include information such as your device's Internet Protocol ("IP") address, `;
    policy += `device name, operating system version, the configuration of the App, the time and date of `;
    policy += `your use of the service, and other statistics.\n\n`;
  }

  if(sections.location) {
    policy += `LOCATION INFORMATION\n\n`;
    policy += `We may request access to your device's location when you use certain features of our App. `;
    policy += `Location information is used to provide location-based services and features. `;
    policy += `You can enable or disable location services through your device settings at any time.\n\n`;
  }

  if(sections.camera) {
    policy += `CAMERA AND MICROPHONE ACCESS\n\n`;
    policy += `Our App may request access to your device's camera and microphone for specific features. `;
    policy += `We only access these features when you explicitly grant permission. `;
    policy += `Media captured through these features is processed only for the purpose of the feature `;
    policy += `you are using and is not stored without your explicit consent.\n\n`;
  }

  if(sections.notifications) {
    policy += `PUSH NOTIFICATIONS\n\n`;
    policy += `We may send push notifications to your device. You can opt out of receiving these `;
    policy += `notifications by adjusting the notification settings on your mobile device. `;
    policy += `We collect data about notification interactions to improve our notification content and delivery.\n\n`;
  }

  if(sections.payment) {
    policy += `PAYMENT INFORMATION\n\n`;
    policy += `If you make purchases through our App, your payment information is processed by our `;
    policy += `payment processors. We do not store your full credit card number or payment credentials `;
    policy += `on our servers. All transactions are secured using industry-standard encryption.\n\n`;
  }

  if(sections.children) {
    policy += `CHILDREN'S PRIVACY\n\n`;
    policy += `Our service does not address anyone under the age of 13. We do not knowingly collect `;
    policy += `personally identifiable information from children under 13. If you are a parent or guardian `;
    policy += `and you are aware that your child has provided us with personal data, please contact us. `;
    policy += `If we become aware that we have collected personal data from children without verification `;
    policy += `of parental consent, we will take steps to remove that information from our servers.\n\n`;
  }

  if(sections.gdpr) {
    policy += `GDPR — YOUR RIGHTS UNDER EUROPEAN LAW\n\n`;
    policy += `If you are located in the European Economic Area (EEA), you have certain data protection `;
    policy += `rights. ${data.companyName} aims to take reasonable steps to allow you to correct, amend, `;
    policy += `delete, or limit the use of your personal data.\n\n`;
    policy += `You have the right to:\n`;
    policy += `• Access — request copies of your personal data\n`;
    policy += `• Rectification — request correction of inaccurate data\n`;
    policy += `• Erasure — request deletion of your personal data\n`;
    policy += `• Restrict processing — request restriction of processing\n`;
    policy += `• Data portability — request transfer of your data\n`;
    policy += `• Object — object to our processing of your data\n\n`;
    policy += `To exercise any of these rights, please contact us at ${data.contactEmail}.\n\n`;
  }

  if(sections.ccpa) {
    policy += `CCPA — CALIFORNIA CONSUMER PRIVACY RIGHTS\n\n`;
    policy += `If you are a California resident, you have the right to:\n\n`;
    policy += `• Know what personal information is collected about you\n`;
    policy += `• Know whether your personal information is sold or disclosed and to whom\n`;
    policy += `• Say no to the sale of personal information\n`;
    policy += `• Access your personal information\n`;
    policy += `• Equal service and price, even if you exercise your privacy rights\n\n`;
    policy += `To exercise your rights under CCPA, contact us at ${data.contactEmail}.\n\n`;
  }

  if(sections.retention) {
    policy += `DATA RETENTION\n\n`;
    policy += `We retain your personal information for as long as necessary to fulfill the purposes `;
    policy += `outlined in this Privacy Policy, unless a longer retention period is required or `;
    policy += `permitted by law. When we no longer need your personal information, we will securely `;
    policy += `delete or anonymize it.\n\n`;
  }

  if(sections.security) {
    policy += `SECURITY\n\n`;
    policy += `The security of your personal information is important to us. We implement `;
    policy += `industry-standard security measures including:\n\n`;
    policy += `• SSL/TLS encryption for data in transit\n`;
    policy += `• Encryption of data at rest\n`;
    policy += `• Regular security audits and assessments\n`;
    policy += `• Access controls and authentication measures\n\n`;
    policy += `However, no method of transmission over the Internet or method of electronic storage `;
    policy += `is 100% secure. We cannot guarantee absolute security.\n\n`;
  }

  if(sections.userRights) {
    policy += `YOUR CHOICES AND RIGHTS\n\n`;
    policy += `You have the following choices regarding your personal information:\n\n`;
    policy += `• Account Information — You may update or delete your account information at any time\n`;
    policy += `• Marketing Communications — You may opt out of marketing emails by following unsubscribe instructions\n`;
    policy += `• Data Deletion — You may request deletion of your personal data by contacting us\n`;
    policy += `• Cookies — You can control cookies through your browser settings\n\n`;
  }

  if(sections.links) {
    policy += `LINKS TO OTHER SITES\n\n`;
    policy += `Our ${getAppTypeLabel(data.appType)} may contain links to third-party websites. `;
    policy += `If you click on a third-party link, you will be directed to that site. `;
    policy += `Note that these external sites are not operated by us. We strongly advise you `;
    policy += `to review the Privacy Policy of every site you visit. We have no control over `;
    policy += `and assume no responsibility for the content, privacy policies, or practices of `;
    policy += `any third-party sites or services.\n\n`;
  }

  if(sections.changes) {
    policy += `CHANGES TO THIS PRIVACY POLICY\n\n`;
    policy += `We may update our Privacy Policy from time to time. We will notify you of any changes `;
    policy += `by posting the new Privacy Policy on this page and updating the "Last Updated" date. `;
    policy += `You are advised to review this Privacy Policy periodically for any changes. `;
    policy += `Changes to this Privacy Policy are effective when they are posted.\n\n`;
  }

  if(sections.contact) {
    policy += `CONTACT US\n\n`;
    policy += `If you have any questions about this Privacy Policy, please contact us:\n\n`;
    policy += `Company: ${data.companyName}\n`;
    policy += `Email: ${data.contactEmail}\n`;
    if(data.websiteUrl && data.websiteUrl !== '[Website URL]') {
      policy += `Website: ${data.websiteUrl}\n`;
    }
    if(data.physicalAddress) {
      policy += `Address: ${data.physicalAddress}\n`;
    }
    policy += `\n`;
  }

  // Update preview
  renderPreview(policy, data, date);
  updateStats(policy, sections);
  return policy;
}

// ── Render Preview ─────────────────────────────────────────────
function renderPreview(policy, data, date) {
  const preview = $('policyPreview');

  if(previewMode === 'raw') {
    preview.innerHTML = `<div class="raw-preview">${escapeHTML(policy)}</div>`;
    return;
  }

  // Formatted HTML preview
  let html = `<div class="policy-content">`;
  html += `<h1>Privacy Policy — ${escapeHTML(data.appName)}</h1>`;
  html += `<span class="policy-date">Last Updated: ${date}</span>`;

  const sections = policy.split('\n\n');
  let inSection  = false;

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    if(!lines[0]) return;

    // Check if it's a heading (all caps)
    if(lines[0] === lines[0].toUpperCase() && lines[0].length > 3 && !lines[0].startsWith('•')) {
      html += `<h2>${escapeHTML(lines[0])}</h2>`;
      const rest = lines.slice(1).join('\n').trim();
      if(rest) html += formatContent(rest);
    } else {
      html += formatContent(section);
    }
  });

  html += `</div>`;
  preview.innerHTML = html;
}

function formatContent(text) {
  const lines = text.split('\n');
  let html    = '';
  let inList  = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if(!trimmed) {
      if(inList) { html += '</ul>'; inList = false; }
      return;
    }
    if(trimmed.startsWith('•')) {
      if(!inList) { html += '<ul>'; inList = true; }
      html += `<li>${escapeHTML(trimmed.slice(1).trim())}</li>`;
    } else {
      if(inList) { html += '</ul>'; inList = false; }
      html += `<p>${escapeHTML(trimmed)}</p>`;
    }
  });
  if(inList) html += '</ul>';
  return html;
}

// ── Update Stats ───────────────────────────────────────────────
function updateStats(policy, sections) {
  const words    = policy.trim().split(/\s+/).filter(w => w).length;
  const readTime = Math.ceil(words / 200);
  const total    = SECTION_KEYS.length;
  const active   = SECTION_KEYS.filter(k => sections[k]).length;
  const score    = Math.round((active / total) * 100);

  $('wordCount').textContent         = words.toLocaleString();
  $('readTime').textContent          = `${readTime} min`;
  $('sectionCount').textContent      = active;
  $('completenessScore').textContent = `${score}%`;
  $('completenessBar').style.width   = `${score}%`;
}

// ── Export ─────────────────────────────────────────────────────
function exportPolicy(format) {
  const data    = getFormData();
  const policy  = generatePolicy();
  const name    = data.appName.replace(/\s+/g, '-').toLowerCase();
  const date    = new Date(data.lastUpdated).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});

  let content = '', mime = '', ext = '';

  if(format === 'txt') {
    content = policy; mime = 'text/plain'; ext = 'txt';
  } else if(format === 'html') {
    content = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Privacy Policy — ${data.appName}</title>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.8; color: #333; }
  h1 { font-size: 2rem; color: #1a1a2e; margin-bottom: 6px; }
  h2 { font-size: 1.1rem; color: #1a1a2e; margin: 28px 0 10px; border-left: 4px solid #6366f1; padding-left: 12px; }
  p  { margin-bottom: 12px; }
  ul { margin: 8px 0 12px 24px; }
  li { margin-bottom: 4px; }
  .date { color: #666; font-size: 0.9rem; margin-bottom: 24px; display: block; }
</style>
</head>
<body>
${$('policyPreview').innerHTML}
</body>
</html>`;
    mime = 'text/html'; ext = 'html';
  } else if(format === 'md') {
    content = policyToMarkdown(policy);
    mime = 'text/markdown'; ext = 'md';
  }

  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `privacy-policy-${name}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Policy exported as .${ext}!`, 'success');
}

function policyToMarkdown(policy) {
  return policy
    .replace(/^([A-Z\s&—]+)\n/gm, (match, heading) => {
      if(heading.trim().length > 3) return `## ${heading.trim()}\n`;
      return match;
    })
    .replace(/^• /gm, '- ')
    .replace(/\n\n/g, '\n\n');
}

// ── Copy Policy ────────────────────────────────────────────────
function copyPolicy() {
  const policy = generatePolicy();
  if(!policy.trim() || policy.includes('[App Name]')) {
    showToast('Please fill in your app details first.', 'error'); return;
  }
  navigator.clipboard.writeText(policy).then(() => {
    showToast('Policy copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Copy failed. Please try again.', 'error');
  });
}

// ── Reset Form ─────────────────────────────────────────────────
function resetForm() {
  if(!confirm('Reset all form data? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  $('appName').value = '';
  $('companyName').value = '';
  $('websiteUrl').value = '';
  $('contactEmail').value = '';
  $('physicalAddress').value = '';
  $('appType').value = 'mobile';
  setDefaultDate();
  applyTemplate('standard');
  Object.keys(TP_SERVICES).forEach(k => { const el = $(k); if(el) el.checked = false; });
  $('policyPreview').innerHTML = `
    <div class="preview-placeholder">
      <i class="fas fa-file-shield"></i>
      <p>Fill in your app details to see the live preview</p>
    </div>
  `;
  $('wordCount').textContent         = '0';
  $('readTime').textContent          = '0 min';
  $('sectionCount').textContent      = '0';
  $('completenessScore').textContent = '0%';
  $('completenessBar').style.width   = '0%';
  showToast('Form reset successfully.', 'info');
}

// ── Helpers ────────────────────────────────────────────────────
function getAppTypeLabel(type) {
  const labels = {
    mobile:'mobile app', web:'web application',
    desktop:'desktop application', saas:'platform', game:'game'
  };
  return labels[type] || 'application';
}

function escapeHTML(str) {
  const el = document.createElement('div');
  el.textContent = str || ''; return el.innerHTML;
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type='success') {
  clearTimeout(toastTimer);
  $('toastMsg').textContent = msg;
  const icon = $('toast').querySelector('.toast-icon');
  icon.className = `toast-icon fas ${
    type==='success' ? 'fa-check-circle' :
    type==='error'   ? 'fa-times-circle' : 'fa-info-circle'
  }`;
  $('toast').className = `toast ${type} show`;
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3000);
}

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);