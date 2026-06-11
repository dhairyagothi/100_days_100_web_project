const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const OUTPUT_PATH = path.resolve(__dirname, '../og-image.png');
const TEMP_SVG_PATH = path.join(os.tmpdir(), '100-days-100-web-project-og-image.svg');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="80" y1="0" x2="1120" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0A0A1A"/>
      <stop offset="1" stop-color="#0D1117"/>
    </linearGradient>
    <linearGradient id="panel" x1="740" y1="120" x2="1100" y2="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#10192E"/>
      <stop offset="1" stop-color="#0B1020"/>
    </linearGradient>
    <linearGradient id="accent" x1="160" y1="120" x2="520" y2="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0FF2C8" stop-opacity="0.15"/>
      <stop offset="1" stop-color="#E23744" stop-opacity="0.12"/>
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" stroke="white" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="26" stdDeviation="26" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="36" y="36" width="1128" height="558" rx="32" stroke="white" stroke-opacity="0.08" />
  <path d="M0 0H1200V630H0V0Z" fill="url(#accent)"/>

  <g transform="translate(72 72)">
    <rect x="0" y="0" width="264" height="40" rx="20" fill="#0FF2C8" fill-opacity="0.10" stroke="#0FF2C8" stroke-opacity="0.25"/>
    <circle cx="24" cy="20" r="5" fill="#0FF2C8"/>
    <text x="40" y="26" fill="#0FF2C8" font-size="18" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="0.02em">GSSoC 2026 open projects</text>

    <text x="0" y="118" fill="#F5F7FF" font-size="76" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="900" letter-spacing="-0.04em">100 Days,</text>
    <text x="0" y="198" fill="#F5F7FF" font-size="76" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="900" letter-spacing="-0.04em">100 Web Projects</text>

    <text x="0" y="250" fill="rgba(245,247,255,0.74)" font-size="26" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="500">
      A living archive of frontend experiments, practical UI polish,
    </text>
    <text x="0" y="284" fill="rgba(245,247,255,0.74)" font-size="26" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="500">
      and open-source contributions built to be explored and shipped.
    </text>

    <g transform="translate(0 326)">
      <rect x="0" y="0" width="94" height="36" rx="18" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.08"/>
      <rect x="106" y="0" width="94" height="36" rx="18" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.08"/>
      <rect x="212" y="0" width="144" height="36" rx="18" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.08"/>
      <rect x="368" y="0" width="106" height="36" rx="18" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.08"/>
      <rect x="486" y="0" width="124" height="36" rx="18" fill="white" fill-opacity="0.05" stroke="white" stroke-opacity="0.08"/>
      <text x="22" y="24" fill="#F5F7FF" font-size="18" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="600">HTML</text>
      <text x="129" y="24" fill="#F5F7FF" font-size="18" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="600">CSS</text>
      <text x="232" y="24" fill="#F5F7FF" font-size="18" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="600">JavaScript</text>
      <text x="396" y="24" fill="#F5F7FF" font-size="18" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="600">React</text>
      <text x="507" y="24" fill="#F5F7FF" font-size="18" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="600">Node.js</text>
    </g>
  </g>

  <g transform="translate(720 110)" filter="url(#shadow)">
    <rect width="400" height="410" rx="28" fill="url(#panel)" stroke="white" stroke-opacity="0.08"/>
    <g transform="translate(24 24)">
      <text x="0" y="24" fill="#F5F7FF" font-size="20" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800">Project cards</text>
      <text x="290" y="24" fill="rgba(245,247,255,0.55)" font-size="14" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700">Ready to contribute</text>
    </g>
    <g transform="translate(24 64)">
      <rect width="168" height="138" rx="20" fill="#090E1C" stroke="white" stroke-opacity="0.08"/>
      <rect x="184" width="168" height="138" rx="20" fill="#090E1C" stroke="white" stroke-opacity="0.08"/>
      <rect y="154" width="168" height="138" rx="20" fill="#090E1C" stroke="white" stroke-opacity="0.08"/>
      <rect x="184" y="154" width="168" height="138" rx="20" fill="#090E1C" stroke="white" stroke-opacity="0.08"/>

      <text x="16" y="36" fill="rgba(245,247,255,0.42)" font-size="13" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="0.14em">BROWSE</text>
      <text x="16" y="72" fill="#F5F7FF" font-size="22" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800">Find a quick win</text>
      <text x="16" y="116" fill="rgba(245,247,255,0.72)" font-size="16" font-family="Inter, Arial, Helvetica, sans-serif">open issues</text>

      <text x="200" y="36" fill="rgba(245,247,255,0.42)" font-size="13" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="0.14em">PREVIEW</text>
      <text x="200" y="72" fill="#F5F7FF" font-size="22" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800">See previews</text>
      <text x="200" y="116" fill="rgba(245,247,255,0.72)" font-size="16" font-family="Inter, Arial, Helvetica, sans-serif">thumbnails + source</text>

      <text x="16" y="190" fill="rgba(245,247,255,0.42)" font-size="13" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="0.14em">SHIP</text>
      <text x="16" y="226" fill="#F5F7FF" font-size="22" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800">Small fixes</text>
      <text x="16" y="270" fill="rgba(245,247,255,0.72)" font-size="16" font-family="Inter, Arial, Helvetica, sans-serif">docs / a11y / UI polish</text>

      <text x="200" y="190" fill="rgba(245,247,255,0.42)" font-size="13" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="0.14em">TRACK</text>
      <text x="200" y="226" fill="#F5F7FF" font-size="22" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800">Keep pace</text>
      <text x="200" y="270" fill="rgba(245,247,255,0.72)" font-size="16" font-family="Inter, Arial, Helvetica, sans-serif">PRs and points</text>
    </g>
  </g>

  <g transform="translate(72 490)">
    <text x="0" y="0" fill="rgba(245,247,255,0.56)" font-size="16" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="600">100-days-100-web-project</text>
    <text x="0" y="28" fill="rgba(245,247,255,0.38)" font-size="14" font-family="Inter, Arial, Helvetica, sans-serif">crafted for steady, visible contributions</text>
  </g>

  <g transform="translate(922 520)">
    <text x="0" y="0" fill="rgba(245,247,255,0.54)" font-size="14" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700">og-image.png</text>
  </g>
</svg>`;

function main() {
  fs.writeFileSync(TEMP_SVG_PATH, svg, 'utf8');

  const result = spawnSync('sips', ['-s', 'format', 'png', TEMP_SVG_PATH, '--out', OUTPUT_PATH], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error('Failed to convert OG SVG to PNG');
  }

  try {
    fs.unlinkSync(TEMP_SVG_PATH);
  } catch (error) { }

  console.log(`Created ${OUTPUT_PATH}`);
}

main();
