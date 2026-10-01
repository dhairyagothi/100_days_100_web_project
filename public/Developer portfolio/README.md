# Developer Portfolio

A modern, fully responsive developer portfolio website showcasing skills, projects, professional experience, and contact information with smooth animations and interactive UI.

## Description

This is a sleek, one-page portfolio website designed for developers and software engineers to showcase their work, skills, and experience. The portfolio features a dark modern theme with gradient accents, smooth scrolling navigation, interactive project cards, and an experience timeline. Perfect for freelancers, job seekers, or any developer wanting to build a professional online presence.

## Features

- **Hero Section**: Eye-catching intro with developer avatar, headline, and call-to-action buttons (Get In Touch, Download CV)
- **Skills Showcase**: Grid of tech stack icons with hover animations (JavaScript, Node.js, HTML5, CSS3, React, etc.)
- **Projects Showcase**: Interactive project cards with hover effects and external links to live projects or repositories
- **Experience Timeline**: Detailed work history with company logos, titles, employment dates, and job descriptions
- **Contact Section**: Email contact link and social media profiles (Instagram, Twitter/X, YouTube) with hover animations
- **Smooth Scrolling Navigation**: Navbar with smooth scroll-to-section behavior on link clicks
- **Mobile Menu**: Hamburger menu toggle that adapts for small screens (< 860px)
- **Responsive Design**: Fully responsive layout with dedicated mobile breakpoints (480px, 768px, 860px, 380px)
- **Smooth Animations**:
  - Avatar rotation on hover
  - Button scale animation on mouse hover
  - Skill cards lift and colorize on hover
  - Project cards lift with shadow on hover
  - Experience cards slide on hover
  - Social icon scale animation
- **Fixed Sticky Navbar**: Navigation stays accessible while scrolling
- **Page Load Animation**: Fade-in effect on page load for smooth visual transition
- **Gradient Text Effects**: Colorful gradient text on headings for visual appeal
- **Dark Theme**: Professional dark background with light text for reduced eye strain

## Tech Stack

- **HTML5** — semantic structure and accessibility
- **CSS3** — flexbox, gradients, animations, media queries, responsive design, backdrop filters
- **Vanilla JavaScript (ES6)** — smooth scroll navigation, mobile menu toggle, hover animations, page load effects, responsive resizing

## Folder Structure

```text
Developer portfolio/
│
├── index.html           # Main portfolio page — all sections
├── script.js            # Mobile menu, smooth scroll, animations
├── style.css            # Dark theme, responsive design, animations
├── assets/
│   ├── logo.png         # Portfolio logo
│   ├── avatar.png       # Developer profile picture
│   ├── View Icon.png    # Project link arrow icon
│   ├── skills/          # Tech stack icons (JavaScript, React, Node.js, etc.)
│   │   ├── javascript.png
│   │   ├── nodejs.png
│   │   ├── html.png
│   │   ├── css.png
│   │   └── reactjs.png
│   ├── projects/        # Project thumbnail images
│   │   ├── project-thumbnail-1.png
│   │   └── project-thumbnail-2.png
│   ├── experience/      # Company logos
│   │   ├── google-logo.png
│   │   ├── meta-logo.png
│   │   └── apple-logo.png
│   └── contact/         # Social media & contact icons
│       ├── Email Icon.png
│       ├── instagram.png
│       ├── x.png
│       └── youtube.png
└── README.md             # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. All code is vanilla HTML, CSS, and JavaScript.

### Option 1: Open Directly
1. Navigate to the `Developer portfolio` folder.
2. Double-click `index.html` to open in your default browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Navigation
Click any navbar link (Home, Projects, Experience, Contact) to smoothly scroll to that section. On mobile (< 860px), click the hamburger menu (☰) to toggle the mobile nav menu.

### Sections

**Hero Section (Home)**
- Displays developer avatar, headline, and professional bio
- "Get In Touch" button links to LinkedIn or social profile
- "Download CV" button downloads resume PDF

**Skills Section**
- Shows tech stack as a grid of icons with labels
- Hover over skills to see them colorize and lift up
- Demonstrates technologies the developer is proficient in

**Projects Section**
- Interactive project cards with thumbnail images
- Click any project card to visit the live project or repository
- Cards lift on hover with shadow effect

**Experience Section**
- Timeline of work history displayed as cards
- Each card shows company logo, job title, employment dates, and job description
- Cards slide slightly on hover

**Contact Section**
- Email link for direct contact
- Social media profile links (Instagram, Twitter/X, YouTube)
- Short bio/professional summary
- Hover effects on all interactive elements

### Responsive Behavior
- **Desktop (> 860px)**: Full horizontal navbar, side-by-side project cards, full skill grid
- **Tablet (768px - 860px)**: Hamburger menu appears, adjusted spacing and font sizes
- **Mobile (480px - 768px)**: Stacked layout, hamburger menu, single-column projects
- **Small Mobile (< 480px)**: Optimized for small screens, grid skill cards, minimal padding

## How It Works

### Smooth Scroll Navigation
```javascript
link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
});
```
Clicking navbar links smoothly scrolls to the corresponding section using native `scrollIntoView` API.

### Mobile Menu Toggle
A hamburger menu icon appears on screens < 860px. Clicking it toggles the `active` class on the nav menu, which uses CSS transitions to slide it in/out.

### Button Hover Animation
```javascript
button.addEventListener('mouseenter', () => {
    button.style.transform = "scale(1.05)";
});
```
Buttons scale up slightly on hover for interactive feedback.

### Page Load Fade
```javascript
window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    requestAnimationFrame(() => { document.body.style.opacity = "1"; });
});
```
The page fades in smoothly on load using opacity transition.

### Responsive Menu Closing
On desktop resize (> 860px), the mobile menu automatically closes to prevent UI issues.

## Implementation Notes

- **Dark Theme**: Uses `#161513` background with `#C5C5C5` text for readability and modern aesthetic
- **Flexbox Layouts**: All sections use flexbox for alignment and responsive behavior
- **Gradient Text**: Headings use CSS `background-clip: text` for colorful gradient effects
- **Smooth Scroll Behavior**: Set globally with `scroll-behavior: smooth` in CSS
- **Icon Hover Effects**: Skill icons use `filter: grayscale()` that animates to full color on hover
- **Mobile First**: CSS uses mobile-first approach with media queries for larger screens
- **No Dependencies**: Pure vanilla code — no jQuery, no frameworks, no build tools
- **Accessibility**: Semantic HTML with aria-labels on social links

## Educational Value

This project demonstrates:

- Semantic HTML5 structure with proper section organization
- Advanced CSS3 techniques (gradients, animations, flexbox, media queries)
- Vanilla JavaScript event handling and DOM manipulation
- Responsive design with mobile-first approach
- Smooth scrolling and page transitions
- Hover animations and state management
- Mobile menu implementation
- CSS variable usage and organization
- Professional design patterns for portfolios

## Future Enhancements

Potential improvements:

- **Dark/Light Theme Toggle**: Add theme switcher for user preference
- **Animated Skill Progress Bars**: Show skill proficiency levels with animated bars
- **Project Filtering**: Filter projects by technology or category
- **Blog Section**: Add a blog for tech writing and thought leadership
- **Contact Form**: Functional contact form with backend email integration
- **Analytics**: Implement visitor tracking and analytics
- **PDF Resume**: Integrated resume viewer instead of just download link
- **Testimonials Carousel**: Client or colleague testimonials
- **Performance Metrics**: GitHub stats or coding profile integration
- **Search Functionality**: Search projects and experience
- **Internationalization**: Multi-language support
- **CMS Integration**: Connect to headless CMS for dynamic content management

## Customization

To customize this portfolio:
1. Replace `assets/avatar.png` with your own profile picture
2. Update HTML text with your own name, bio, skills, projects, and experience
3. Replace skill icons in `assets/skills/` with your tech stack
4. Add your project thumbnails and links
5. Update company logos and job descriptions
6. Change email and social media links in the contact section
7. Modify colors in `style.css` root CSS variables

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
