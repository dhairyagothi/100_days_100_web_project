```
   ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
        CV BUILDER & ATS REAL-TIME COMPLIANCE CHECKER
   ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
       Interactive Form or Markdown In  ·  Algorithmic Fit Out

> **Answer questions in a guided form or drop in raw Markdown.** Watch an ATS-optimized, single-column resume update instantly on an simulated A4 paper canvas — built completely client-side with zero heavy backend frameworks.

---

## At a glance
```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │  ◆ Curriculum.io  [ ATS COMPLIANT ]   [ 🗂 Browse Blueprints ]  ☀️  [Clear] [PDF] │
 ├──────────────────────────────────────┬──┬───────────────────────────────────┤
 │  [ Guided Form ]  [ Raw Markdown ]   │  │  LIVE PREVIEW (A4 METRIC SHEET)   │
 │  ──────────────────────────────────  │  │  ───────────────────────────────  │
 │  1. Personal Information             │  │                                   │
 │  [ Full Name Input               ]   │  │             Full Name             │
 │  [ Target Professional Title     ]   │  │     Title · Contact · Links       │
 │  [ Multi-Field Contact Array     ]   │  │  ───────────────────────────────  │
 │  2. Professional Summary             │  │  SUMMARY                          │
 │  [ Textarea Pitch Matrix         ]   │  │  Clean, machine-readable string.  │
 │  3. Work History                     │  │                                   │
 │  [ Sectioned Achievement Boxes   ]   │  │  EXPERIENCE                       │
 │                                      │  │  • Senior Specialist — Firm       │
 │  (form fields auto-sync to md)       │  │    • Action-driven achievement.   │
 └──────────────────────────────────────┴──┴───────────────────────────────────┘
```

---

## Core Capabilities

- **Bi-Directional State Synchronization** — Toggle freely between the **Guided Form Wizard** and **Raw Markdown Editor**. Modifying text boxes updates your Markdown syntax automatically, and pasting Markdown strings parses back to populate separate form cards instantly via structural array indexing.
- **Interactive Initial Selection Overlay** — Displays a premium blueprint selection modal overlay on application boots (or manually using the toolbar), allowing you to pre-load comprehensive structural framework configurations seamlessly.
- **Algorithmic ATS Compliance Engine** — Computes a live metric score percentage utilizing explicit programmatic test checks (validating Name declaration, email routing configurations, core skills grids, and blocking complex parsing clutter like Markdown tables).
- **Dual Mode Manual Theme Toggle** — Supports device color scheme detection while incorporating an explicit custom class selector override trigger to shift the application chrome between a balanced deep aesthetic and a crisp daylight style.
- **A4 Metric Printing Fidelity** — Configured using strict point (`pt`) and inch (`in`) layout rules within custom printing directives to ensure print margins output clean page breaks during PDF exports.

---

## Architectural Deep Dive

### Bi-Directional State Processing Cycle
```mermaid
flowchart TD
    Overlay[Template Modal Blueprint Selection] -->|Loads String Preset| Editor[Raw Editor Value Script Buffer]
    Editor -->|updateFormFromMarkdown Split Parsing| Form[Interactive Guided Input Form Fields]
    Form -->|updateMarkdownFromForm Loop Concatenation| Editor
    Editor -->|parseMarkdown Custom Regex Engine| Preview[Live A4 Sheet Preview innerHTML]
    Editor -->|runAtsAnalysis Array Test Checks| Score[ATS Optimization Sidebar Matrix]
    Preview -->|window.print Invocation| PDF[Print Dialog Screen Output]
    ```

### Advanced Regex Token Parsing Strategy

Rather than relying on heavy external tokenizers or abstract syntax tree (AST) parsers, the application uses an optimized, sequential line-by-line regular expression engine. This keeps the execution footprint near zero while ensuring transparent translation from plain text to machine-readable HTML:

* **Header Token Extraction**: Scans line-starts for active tokens. A single hash `# (.+)` extracts the top-level string to construct the structural `<h1>` wrapper. Double hashes `## (.+)` isolate major section breaks, triggering `<h2>` partitions that feature semantic horizontal accent baselines.
* **Inline Pattern Decoration**: A secondary regex pass evaluates text segments using lookahead boundaries to map text modifiers safely. `\*\*(.+?)\*\*` wraps localized text inside semantic `<strong>` elements without risking bleeding style scopes, while `\[([^\]]+)\]\(([^)]+)\)` transforms text blocks into clickable `<a>` links featuring explicit `noopener` safety variables.
* **Bullet List Grouping**: Instead of isolating list nodes individually—which creates broken, un-closed markup fragments—the compilation engine maintains a continuous state boolean flag (`inList`). It collects consecutive matching instances of `^-\s+(生)` or `^\s*-\s+(.+)`, batches them into an array mapping routine, and flushes them inside a single nested `<ul>` block once a non-list string line or line break is met.
* **Dynamic Contact Line Isolation**: To mimic elegant typographic headers automatically, the custom compilation engine tracks chronological block indices. If a standard plain-text string immediately succeeds the main `<h1>` name block and validates positive on key indicators (such as containing phone patterns, email `@` symbols, or boundary pipes `|`), the system bypasses standard paragraph tags and isolates the block inside a `p.contact-line` utility class.

## Available Pre-Loaded Frameworks

The system comes preloaded with nine distinct, single-column framework templates structured to score beautifully on applicant sorting machines:

| Key Token | Role Blueprint Framework | Specialized Structural Content Focus |
| :---: | --- | --- |
| `se` | **Software Engineering** | Technical stack distribution grids, scalable microservices metrics, and deployment pipelines. |
| `da` | **Data Analytics** | Quantitative pipeline validation layers, visualization tracking tools, and database models. |
| `pm` | **Product Management** | Roadmap strategy formulas, cross-functional execution cycles, and data analytics benchmarks. |
| `mkt` | **Growth Marketing** | Programmatic customer acquisition funnels, conversion attributions, and pipeline scale optimization metrics. |
| `cyber` | **Cybersecurity** | Telemetry scanning rules, incident response playbooks, and continuous threat mitigation loops. |
| `devops` | **DevOps Engineering** | Container runtime layout structures, automated CI configurations, and infrastructure as code arrays. |
| `ux` | **UX/UI Design** | Accessibility design protocols, interactive prototype verification metrics, and core design systems. |
| `hr` | **HR Generalist** | Talent acquisition frameworks, legal compliance auditing, and employee retention strategies. |
| `sdr` | **Sales Development** | Enterprise account prospective loops, discovery lead scoring matrices, and outreach pipelines. |

## Supported Markdown

| Syntax | Example | Renders as |
|--------|---------|------------|
| `#` | `# Jane Doe` | Name (heading 1) |
| `##` | `## Experience` | Section title |
| `###` | `### Subsection` | Subsection title |
| `**text**` | `**Senior Developer**` | **Bold** |
| `- item` | `- Led team of 5` | Bulleted list |
| `[text](url)` | `[Portfolio](https://example.com)` | Clickable link |

The line immediately after your `#` name is styled as a **contact line** when it looks like a subtitle (bold, email, or pipe-separated details).

### Example resume

Copy this into the editor to see the preview in action:

```markdown
# Jane Doe
**Product Designer** | jane@email.com | (555) 123-4567 | [portfolio.com](https://portfolio.com)

## Summary
Designer focused on accessible, human-centered interfaces with 6+ years in SaaS.

## Experience
- **Acme Corp** — Senior Product Designer (2022 – Present)
  - Redesigned onboarding flow; increased activation by 28%
- **Studio North** — UI Designer (2019 – 2022)
  - Shipped design system used across 4 product teams

## Skills
- Figma, prototyping, user research, design systems
- HTML/CSS literacy for tight dev collaboration

---

## Technical Specifications

| Layer | Technology Choice | Operational Parameters |
| :--- | :--- | :--- |
| **Structure** | HTML5 Semantic Engine | Managed with strict standard validation tags and `aria-live` announcements. |
| **Styling** | CSS3 Layout Blueprint | Handled via custom properties, relative flexboxes, and hardware-accelerated animations. |
| **Logic** | ECMAScript 6 Vanilla Script | Operates seamlessly via immediate function execution structures without heavy external compilation dependencies. |
| **Persistence** | Session LocalStorage API | Automatically buffers active workspace contents into text storage blocks debounced at 400ms intervals. |
| **PDF Generation** | Native System Subsystem | Governed using layout parameters to protect page integrity during printing operations. |

---

## Project structure

```
Resume Previewer/
Curriculum.io/
├── index.html       Dual-mode form/editor dashboard, overlay selection modal, metrics panel
├── style.css        Custom typography tokens, theme custom variables, responsive phone grid, print system
├── script.js        Bi-directional sync logic, custom regex engine, template matrices, scoring metrics
└── README.md        Documentation, architecture deep dive, syntax guide, and project specs
```

---

## Design notes

**Custom regex instead of a Markdown library** — Keeps the project dependency-free and makes parsing behavior transparent. You see exactly how `#`, `**`, `-`, and `[text](url)` map to resume HTML.

**Native print instead of PDF libraries** — Browsers already render print layouts well. With tuned `@page` margins, page-break rules, and print-only visibility, Export PDF produces clean results without shipping a heavy PDF generator.

---

<p align="center">
  <strong>No install. No framework. Just open and write.</strong>
</p>
