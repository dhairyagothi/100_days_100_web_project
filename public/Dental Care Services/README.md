# Smile Care - Dental Clinic Website

A professional, multi-page dental clinic website showcasing services, team, pricing, and online appointment booking functionality.

## Description

Smile Care is a fully responsive dental clinic website built to present dental services, display team members, offer pricing plans, and allow patients to book appointments online. The site features multiple pages with smooth animations, interactive carousels, image comparisons, and a professional design optimized for both desktop and mobile devices.

## Features

- **Multi-Page Structure**: Home, About, Services, Pricing Plans, Team Directory, Testimonials, Appointment Booking, Contact
- **Responsive Design**: Bootstrap 5-based layout that adapts to all screen sizes (mobile, tablet, desktop)
- **Sticky Navigation**: Navbar remains at the top as users scroll for easy navigation
- **Image Comparison**: Before/after dental treatment image comparison slider
- **Carousels**: 
  - Pricing carousel with navigation arrows
  - Testimonials carousel with patient reviews
- **Appointment Booking**: Date and time picker for scheduling dental appointments
- **Team Directory**: Display of dentists and dental staff with bios
- **Testimonials**: Patient testimonials with carousel rotation
- **Pricing Plans**: Multiple service packages displayed in a carousel
- **Contact Information**: Business hours, phone, email, and contact form
- **Search Functionality**: Built-in search capability across pages
- **Loading Spinner**: Professional loading animation on page load
- **Back-to-Top Button**: Quick scroll-to-top functionality for long pages
- **Icon Library**: Font Awesome and Bootstrap Icons integrated
- **Smooth Animations**: WOW.js integration for scroll-triggered animations

## Tech Stack

- **HTML5** — semantic page structure and multi-page site layout
- **CSS3** — responsive design, custom styling, animations
- **Bootstrap 5** — responsive grid system, components, utilities
- **jQuery** — DOM manipulation, event handling, plugin initialization
- **JavaScript Libraries**:
  - **Owl Carousel** — price and testimonial carousels
  - **Tempusdominus** — date/time picker for appointments
  - **Twenty Twenty** — image comparison slider
  - **WOW.js** — scroll-triggered animations
- **Font Awesome 5** — icons for UI elements
- **Bootstrap Icons** — additional icon set

## Folder Structure

```text
Dental Care Services/
└── Setup/
    ├── index.html           # Homepage
    ├── about.html           # About the clinic
    ├── service.html         # Services offered
    ├── price.html           # Pricing plans
    ├── team.html            # Dentist team directory
    ├── testimonial.html     # Patient testimonials
    ├── appointment.html     # Appointment booking page
    ├── contact.html         # Contact & contact form
    ├── css/
    │   ├── bootstrap.min.css # Bootstrap framework
    │   └── style.css         # Custom styling
    ├── js/
    │   └── main.js           # jQuery plugins & interactions
    ├── lib/
    │   ├── owlcarousel/      # Carousel library
    │   ├── animate/          # Animation library
    │   ├── tempusdominus/    # Date/time picker
    │   ├── twentytwenty/     # Image comparison
    │   └── easing/           # Animation easing
    ├── img/                  # Images and assets
    └── README.md             # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. All libraries are included locally or loaded via CDN.

### Option 1: Open Directly
1. Navigate to the `Dental Care Services/Setup/` folder.
2. Double-click `index.html` to open in your default browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the `Setup/` folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Navigate the Website
- **Home Page**: Landing page with key services, testimonials, and call-to-action
- **About**: Clinic history and information
- **Services**: Detailed list of dental services offered
- **Pricing**: Browse service packages and pricing options
- **Team**: View dentists and staff profiles
- **Testimonials**: Read patient reviews and experiences
- **Appointment**: Book appointments by selecting date and time
- **Contact**: Get clinic contact info and contact form

### Key Interactions
- **Search**: Click the search icon in the navbar to search the site
- **Carousels**: Use arrow buttons to navigate pricing and testimonial carousels
- **Image Comparison**: Drag the slider to compare before/after treatment photos
- **Appointment Booking**: Select date and time, fill in details, and submit booking
- **Back to Top**: Click the back-to-top button (appears when scrolled down) to jump to page top

## How It Works

### Page Navigation
The navbar includes links to all main pages; the dropdown "Pages" menu groups secondary pages (Pricing, Team, Testimonials, Appointment) for compact navigation.

### Carousels
Owl Carousel handles the price and testimonial sections:
- Price carousel: Auto-plays, shows 1 item on mobile, 2 on tablet/desktop
- Testimonial carousel: Shows 1 item full-width with manual navigation arrows

### Appointment Booking
Uses Tempusdominus date/time picker library to allow users to:
1. Select appointment date from a calendar
2. Select time from time picker
3. Fill in patient details
4. Submit booking

### Image Comparison
The Twenty Twenty library creates an interactive before/after slider for dental procedure visualizations.

### Animations
WOW.js triggers CSS animations on scroll, making elements fade/slide in as they enter the viewport for visual engagement.

### Sticky Navbar
jQuery scroll listener detects when page scrolls past 40px and adds `sticky-top` class to keep navbar visible.

## Implementation Notes

- **Bootstrap 5**: Grid system ensures responsive 1, 2, 3, or 4-column layouts depending on screen size
- **jQuery Required**: Many interactive features depend on jQuery initialization
- **CDN Libraries**: Some libraries (Font Awesome, Bootstrap Icons, Google Fonts) are loaded via CDN
- **Local Libraries**: Heavy dependencies (Owl Carousel, Tempusdominus) are included locally for reliability
- **Contact Form**: HTML form structure included; backend implementation (email sending) would need server-side processing

## Educational Value

This project demonstrates:

- Multi-page website architecture and navigation
- Bootstrap 5 responsive grid and component systems
- jQuery plugin integration and initialization
- Carousel implementation with Owl Carousel
- Form handling and date/time picker integration
- Image comparison interactive components
- Scroll-triggered animations with WOW.js
- Sticky positioning and scroll event handling
- Icon font integration (Font Awesome, Bootstrap Icons)
- Mobile-first responsive design
- Professional UI/UX patterns for service businesses

## Future Enhancements

Potential improvements:

- **Backend Integration**: Connect appointment booking to a database/email system
- **Admin Dashboard**: Allow staff to manage appointments, team info, and services
- **Patient Portal**: Login system for patients to view appointment history and dental records
- **Online Payment**: Integrate payment processing for services or deposits
- **Blog Section**: Add dental health tips and clinic news
- **Virtual Tour**: 360° clinic tour or video walkthrough
- **Customer Reviews**: Integration with Google Reviews or testimonial management system
- **SMS Reminders**: Send appointment reminders via SMS
- **Multi-language Support**: Add language switcher for international patients
- **Appointment Notifications**: Email/SMS confirmations for bookings

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
