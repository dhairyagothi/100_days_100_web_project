\# Cards, Alerts, and Navigation Bars in Bootstrap



\## Introduction



Bootstrap provides several powerful components for displaying content and creating navigation systems.



In this chapter, you will learn:



\- Cards

\- Card layouts

\- Alerts

\- Dismissible alerts

\- Navigation Bars (Navbar)

\- Responsive navigation menus

\- Navigation utilities



These components are widely used in modern websites and web applications.



\---



\# Part 1: Cards



\## What is a Card?



A card is a flexible content container that can hold:



\- Images

\- Text

\- Buttons

\- Links

\- Lists

\- Headers

\- Footers



Cards are commonly used for:



\- Product listings

\- Blog posts

\- User profiles

\- Dashboards

\- Service sections



\---



\# Basic Card



```html

<div class="card">



&#x20;   <div class="card-body">

&#x20;       This is a basic card.

&#x20;   </div>



</div>

```



Output:



```text

+--------------------+

| This is a card     |

+--------------------+

```



\---



\# Card with Title and Text



```html

<div class="card">



&#x20;   <div class="card-body">



&#x20;       <h5 class="card-title">

&#x20;           Card Title

&#x20;       </h5>



&#x20;       <p class="card-text">

&#x20;           Card description goes here.

&#x20;       </p>



&#x20;   </div>



</div>

```



\---



\# Card with Button



```html

<div class="card">



&#x20;   <div class="card-body">



&#x20;       <h5 class="card-title">

&#x20;           Bootstrap Card

&#x20;       </h5>



&#x20;       <p class="card-text">

&#x20;           Learn Bootstrap easily.

&#x20;       </p>



&#x20;       <a href="#" class="btn btn-primary">

&#x20;           Read More

&#x20;       </a>



&#x20;   </div>



</div>

```



\---



\# Card with Image



```html

<div class="card">



&#x20;   <img

&#x20;       src="image.jpg"

&#x20;       class="card-img-top"

&#x20;       alt="Image">



&#x20;   <div class="card-body">



&#x20;       <h5 class="card-title">

&#x20;           Product Name

&#x20;       </h5>



&#x20;       <p class="card-text">

&#x20;           Product description.

&#x20;       </p>



&#x20;   </div>



</div>

```



\---



\# Card Header and Footer



```html

<div class="card">



&#x20;   <div class="card-header">

&#x20;       Featured

&#x20;   </div>



&#x20;   <div class="card-body">



&#x20;       <h5 class="card-title">

&#x20;           Special Offer

&#x20;       </h5>



&#x20;       <p class="card-text">

&#x20;           Limited time deal.

&#x20;       </p>



&#x20;   </div>



&#x20;   <div class="card-footer">

&#x20;       Updated Today

&#x20;   </div>



</div>

```



\---



\# Colored Cards



\## Primary Card



```html

<div class="card text-white bg-primary">

&#x20;   <div class="card-body">

&#x20;       Primary Card

&#x20;   </div>

</div>

```



\---



\## Success Card



```html

<div class="card text-white bg-success">

&#x20;   <div class="card-body">

&#x20;       Success Card

&#x20;   </div>

</div>

```



\---



\## Danger Card



```html

<div class="card text-white bg-danger">

&#x20;   <div class="card-body">

&#x20;       Danger Card

&#x20;   </div>

</div>

```



\---



\# Card Groups



Display multiple cards together.



```html

<div class="card-group">



&#x20;   <div class="card">

&#x20;       <div class="card-body">

&#x20;           Card 1

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="card">

&#x20;       <div class="card-body">

&#x20;           Card 2

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="card">

&#x20;       <div class="card-body">

&#x20;           Card 3

&#x20;       </div>

&#x20;   </div>



</div>

```



\---



\# Cards Using Grid System



```html

<div class="row">



&#x20;   <div class="col-md-4">



&#x20;       <div class="card">

&#x20;           <div class="card-body">

&#x20;               Card 1

&#x20;           </div>

&#x20;       </div>



&#x20;   </div>



&#x20;   <div class="col-md-4">



&#x20;       <div class="card">

&#x20;           <div class="card-body">

&#x20;               Card 2

&#x20;           </div>

&#x20;       </div>



&#x20;   </div>



&#x20;   <div class="col-md-4">



&#x20;       <div class="card">

&#x20;           <div class="card-body">

&#x20;               Card 3

&#x20;           </div>

&#x20;       </div>



&#x20;   </div>



</div>

```



Responsive behavior:



```text

Desktop:

|Card1|Card2|Card3|



Mobile:

Card1

Card2

Card3

```



\---



\# Profile Card Example



```html

<div class="card" style="width:300px;">



&#x20;   <img

&#x20;       src="profile.jpg"

&#x20;       class="card-img-top"

&#x20;       alt="Profile">



&#x20;   <div class="card-body">



&#x20;       <h5 class="card-title">

&#x20;           John Doe

&#x20;       </h5>



&#x20;       <p class="card-text">

&#x20;           Frontend Developer

&#x20;       </p>



&#x20;       <button class="btn btn-primary">

&#x20;           Contact

&#x20;       </button>



&#x20;   </div>



</div>

```



\---



\# Part 2: Alerts



\## What is an Alert?



Alerts provide feedback messages to users.



Examples:



\- Success messages

\- Error notifications

\- Warnings

\- Information notices



\---



\# Basic Alert



```html

<div class="alert alert-primary">

&#x20;   This is a primary alert.

</div>

```



\---



\# Alert Variants



Bootstrap offers several alert styles.



\---



\## Primary



```html

<div class="alert alert-primary">

&#x20;   Primary Alert

</div>

```



\---



\## Secondary



```html

<div class="alert alert-secondary">

&#x20;   Secondary Alert

</div>

```



\---



\## Success



```html

<div class="alert alert-success">

&#x20;   Operation Completed Successfully.

</div>

```



\---



\## Danger



```html

<div class="alert alert-danger">

&#x20;   Something Went Wrong.

</div>

```



\---



\## Warning



```html

<div class="alert alert-warning">

&#x20;   Warning Message.

</div>

```



\---



\## Info



```html

<div class="alert alert-info">

&#x20;   Information Message.

</div>

```



\---



\## Dark



```html

<div class="alert alert-dark">

&#x20;   Dark Alert.

</div>

```



\---



\# Alert with Link



```html

<div class="alert alert-primary">



&#x20;   Visit

&#x20;   <a href="#" class="alert-link">

&#x20;       Documentation

&#x20;   </a>



</div>

```



\---



\# Alert Heading



```html

<div class="alert alert-success">



&#x20;   <h4 class="alert-heading">

&#x20;       Success!

&#x20;   </h4>



&#x20;   <p>

&#x20;       Your account has been created.

&#x20;   </p>



</div>

```



\---



\# Dismissible Alerts



Users can close alerts.



```html

<div

&#x20;   class="alert alert-warning alert-dismissible fade show">



&#x20;   Warning Message



&#x20;   <button

&#x20;       type="button"

&#x20;       class="btn-close"

&#x20;       data-bs-dismiss="alert">

&#x20;   </button>



</div>

```



\---



\# Mini Alert Example



```html

<div class="alert alert-success">



&#x20;   Registration Successful!



</div>

```



\---



\# Part 3: Navigation Bars



\## What is a Navbar?



A Navbar is a navigation component that helps users move through a website.



Common items:



\- Logo

\- Menu Links

\- Search Box

\- Login Button

\- Dropdowns



\---



\# Basic Navbar



```html

<nav class="navbar navbar-light bg-light">



&#x20;   <a class="navbar-brand" href="#">

&#x20;       My Website

&#x20;   </a>



</nav>

```



\---



\# Dark Navbar



```html

<nav class="navbar navbar-dark bg-dark">



&#x20;   <a class="navbar-brand" href="#">

&#x20;       My Website

&#x20;   </a>



</nav>

```



\---



\# Navbar with Links



```html

<nav class="navbar navbar-expand-lg navbar-light bg-light">



&#x20;   <div class="container">



&#x20;       <a class="navbar-brand" href="#">

&#x20;           Brand

&#x20;       </a>



&#x20;       <ul class="navbar-nav">



&#x20;           <li class="nav-item">

&#x20;               <a class="nav-link" href="#">

&#x20;                   Home

&#x20;               </a>

&#x20;           </li>



&#x20;           <li class="nav-item">

&#x20;               <a class="nav-link" href="#">

&#x20;                   About

&#x20;               </a>

&#x20;           </li>



&#x20;           <li class="nav-item">

&#x20;               <a class="nav-link" href="#">

&#x20;                   Contact

&#x20;               </a>

&#x20;           </li>



&#x20;       </ul>



&#x20;   </div>



</nav>

```



\---



\# Responsive Navbar



```html

<nav

class="navbar navbar-expand-lg navbar-light bg-light">



<div class="container">



<a class="navbar-brand" href="#">

Logo

</a>



<button

class="navbar-toggler"

type="button"

data-bs-toggle="collapse"

data-bs-target="#menu">



<span class="navbar-toggler-icon"></span>



</button>



<div

class="collapse navbar-collapse"

id="menu">



<ul class="navbar-nav ms-auto">



<li class="nav-item">

<a class="nav-link" href="#">

Home

</a>

</li>



<li class="nav-item">

<a class="nav-link" href="#">

Services

</a>

</li>



<li class="nav-item">

<a class="nav-link" href="#">

Contact

</a>

</li>



</ul>



</div>



</div>

</nav>

```



\---



\# Navbar Brand



```html

<a class="navbar-brand" href="#">

&#x20;   BootstrapSite

</a>

```



Can contain:



\- Text

\- Logo

\- Image



\---



\# Navbar with Search Form



```html

<form class="d-flex">



&#x20;   <input

&#x20;       class="form-control me-2"

&#x20;       type="search"

&#x20;       placeholder="Search">



&#x20;   <button

&#x20;       class="btn btn-outline-success">

&#x20;       Search

&#x20;   </button>



</form>

```



\---



\# Navbar with Button



```html

<button class="btn btn-primary">

&#x20;   Login

</button>

```



\---



\# Fixed Navbar



\## Fixed Top



```html

<nav class="navbar fixed-top navbar-dark bg-dark">

```



\---



\## Fixed Bottom



```html

<nav class="navbar fixed-bottom navbar-dark bg-dark">

```



\---



\# Sticky Navbar



```html

<nav class="navbar sticky-top navbar-light bg-light">

```



Navbar remains visible while scrolling.



\---



\# Navigation Pills



```html

<ul class="nav nav-pills">



&#x20;   <li class="nav-item">

&#x20;       <a class="nav-link active">

&#x20;           Home

&#x20;       </a>

&#x20;   </li>



&#x20;   <li class="nav-item">

&#x20;       <a class="nav-link">

&#x20;           About

&#x20;       </a>

&#x20;   </li>



</ul>

```



\---



\# Navigation Tabs



```html

<ul class="nav nav-tabs">



&#x20;   <li class="nav-item">

&#x20;       <a class="nav-link active">

&#x20;           Home

&#x20;       </a>

&#x20;   </li>



&#x20;   <li class="nav-item">

&#x20;       <a class="nav-link">

&#x20;           Contact

&#x20;       </a>

&#x20;   </li>



</ul>

```



\---



\# Mini Project



\## Product Cards Section



```html

<div class="container">



&#x20;   <div class="row">



&#x20;       <div class="col-md-4">



&#x20;           <div class="card">



&#x20;               <img

&#x20;                   src="product.jpg"

&#x20;                   class="card-img-top">



&#x20;               <div class="card-body">



&#x20;                   <h5 class="card-title">

&#x20;                       Product 1

&#x20;                   </h5>



&#x20;                   <p class="card-text">

&#x20;                       Product Description

&#x20;                   </p>



&#x20;                   <button

&#x20;                       class="btn btn-primary">

&#x20;                       Buy Now

&#x20;                   </button>



&#x20;               </div>



&#x20;           </div>



&#x20;       </div>



&#x20;   </div>



</div>

```



\---



\# Practice Exercise 1



Create three cards displaying:



\- Image

\- Title

\- Description

\- Button



Use Bootstrap Grid for responsiveness.



\---



\# Practice Exercise 2



Create a responsive navbar containing:



\- Logo

\- Home

\- About

\- Services

\- Contact

\- Login Button



\---



\# Best Practices



\### Cards



\- Keep card content concise.

\- Use images of consistent size.

\- Maintain equal card heights.



\### Alerts



\- Use colors semantically.

\- Avoid excessive alerts.

\- Make important alerts dismissible.



\### Navbars



\- Keep navigation simple.

\- Use responsive menus.

\- Place important links first.

\- Use sticky or fixed navbars only when necessary.



\---



\# Summary



\## Cards



\- Basic cards

\- Images

\- Headers and footers

\- Card groups

\- Responsive card layouts



\## Alerts



\- Success messages

\- Error messages

\- Warning messages

\- Dismissible alerts



\## Navigation Bars



\- Basic navbar

\- Responsive navbar

\- Navbar brand

\- Search forms

\- Fixed and sticky navbars

\- Navigation pills

\- Navigation tabs



These components are fundamental building blocks for creating modern, responsive Bootstrap websites and web applications.

