\# Modals, Toasts, Offcanvas Components, Tables, and Lists in Bootstrap



\## Introduction



Bootstrap provides several components that improve user interaction and data presentation.



In this chapter, you will learn:



\- Modals

\- Toasts

\- Offcanvas Components

\- Tables

\- Lists

\- Responsive Tables

\- List Groups



These components are commonly used in dashboards, admin panels, e-commerce sites, and modern web applications.



\---



\# Part 1: Modals



\## What is a Modal?



A modal is a popup window that appears above the page content.



Common uses:



\- Login forms

\- Registration forms

\- Confirmation dialogs

\- User notifications

\- Product previews



\---



\# Basic Modal Structure



```html

<!-- Button Trigger -->



<button

class="btn btn-primary"

data-bs-toggle="modal"

data-bs-target="#myModal">



Open Modal



</button>



<!-- Modal -->



<div

class="modal fade"

id="myModal">



<div class="modal-dialog">



<div class="modal-content">



<div class="modal-header">



<h5 class="modal-title">

Modal Title

</h5>



<button

class="btn-close"

data-bs-dismiss="modal">

</button>



</div>



<div class="modal-body">



Modal Content Here



</div>



<div class="modal-footer">



<button

class="btn btn-secondary"

data-bs-dismiss="modal">



Close



</button>



</div>



</div>



</div>



</div>

```



\---



\# Modal Sections



A Bootstrap modal contains:



```text

Modal

&#x20;├── Header

&#x20;├── Body

&#x20;└── Footer

```



\---



\# Modal Sizes



\---



\## Small Modal



```html

<div class="modal-dialog modal-sm">

```



\---



\## Large Modal



```html

<div class="modal-dialog modal-lg">

```



\---



\## Extra Large Modal



```html

<div class="modal-dialog modal-xl">

```



\---



\# Centered Modal



```html

<div class="modal-dialog modal-dialog-centered">

```



\---



\# Scrollable Modal



```html

<div class="modal-dialog modal-dialog-scrollable">

```



Useful for large content.



\---



\# Static Backdrop Modal



Cannot be closed by clicking outside.



```html

<div

class="modal"

data-bs-backdrop="static">

```



\---



\# Login Modal Example



```html

<button

class="btn btn-primary"

data-bs-toggle="modal"

data-bs-target="#loginModal">



Login



</button>

```



```html

<div

class="modal fade"

id="loginModal">



<div class="modal-dialog">



<div class="modal-content">



<div class="modal-header">

<h5>Login</h5>

</div>



<div class="modal-body">



<input

type="email"

class="form-control mb-3"

placeholder="Email">



<input

type="password"

class="form-control"

placeholder="Password">



</div>



<div class="modal-footer">



<button

class="btn btn-primary">



Login



</button>



</div>



</div>



</div>



</div>

```



\---



\# Part 2: Toasts



\## What is a Toast?



A toast is a lightweight notification message.



Common examples:



\- Saved Successfully

\- Item Added to Cart

\- Message Sent

\- Download Complete



\---



\# Basic Toast



```html

<div class="toast show">



<div class="toast-header">



<strong class="me-auto">

Notification

</strong>



<button

class="btn-close"

data-bs-dismiss="toast">

</button>



</div>



<div class="toast-body">



Data Saved Successfully!



</div>



</div>

```



\---



\# Toast Structure



```text

Toast

&#x20;├── Header

&#x20;└── Body

```



\---



\# Colored Toast



```html

<div

class="toast show text-white bg-success">



<div class="toast-header">



Success



</div>



<div class="toast-body">



Operation Completed



</div>



</div>

```



\---



\# Toast Placement



Bootstrap positioning utilities can place toasts anywhere.



Example:



```html

<div

class="toast-container

position-fixed

bottom-0

end-0

p-3">

```



Bottom-right notification.



\---



\# Auto-Hide Toast



```html

<div

class="toast"

data-bs-delay="3000">

```



Disappears after 3 seconds.



\---



\# Success Notification Example



```html

<div

class="toast show bg-success text-white">



<div class="toast-body">



Profile Updated Successfully



</div>



</div>

```



\---



\# Part 3: Offcanvas



\## What is Offcanvas?



An offcanvas component is a hidden sidebar that slides into view.



Common uses:



\- Mobile menus

\- Filters

\- Shopping carts

\- Settings panels



\---



\# Basic Offcanvas



```html

<button

class="btn btn-primary"

data-bs-toggle="offcanvas"

data-bs-target="#menu">



Open Menu



</button>

```



```html

<div

class="offcanvas offcanvas-start"

id="menu">



<div class="offcanvas-header">



<h5>Menu</h5>



<button

class="btn-close"

data-bs-dismiss="offcanvas">

</button>



</div>



<div class="offcanvas-body">



Content Here



</div>



</div>

```



\---



\# Offcanvas Positions



\---



\## Left



```html

offcanvas-start

```



\---



\## Right



```html

offcanvas-end

```



\---



\## Top



```html

offcanvas-top

```



\---



\## Bottom



```html

offcanvas-bottom

```



\---



\# Mobile Sidebar Example



```html

<div

class="offcanvas offcanvas-start"

id="sidebar">



<div class="offcanvas-header">



<h5>Navigation</h5>



</div>



<div class="offcanvas-body">



<ul>



<li>Home</li>



<li>About</li>



<li>Services</li>



<li>Contact</li>



</ul>



</div>



</div>

```



\---



\# Part 4: Tables



\## What is a Table?



Tables organize data into rows and columns.



Used for:



\- Reports

\- User data

\- Product listings

\- Statistics



\---



\# Basic Table



```html

<table class="table">



<tr>

<th>ID</th>

<th>Name</th>

</tr>



<tr>

<td>1</td>

<td>John</td>

</tr>



</table>

```



\---



\# Table Structure



```text

Table

&#x20;├── Rows

&#x20;├── Columns

&#x20;└── Cells

```



\---



\# Striped Table



```html

<table class="table table-striped">

```



Alternate row colors.



\---



\# Bordered Table



```html

<table class="table table-bordered">

```



Adds borders.



\---



\# Hover Table



```html

<table class="table table-hover">

```



Highlights rows on hover.



\---



\# Dark Table



```html

<table class="table table-dark">

```



Dark theme table.



\---



\# Small Table



```html

<table class="table table-sm">

```



Compact spacing.



\---



\# Table Variants



\---



\## Primary Row



```html

<tr class="table-primary">

```



\---



\## Success Row



```html

<tr class="table-success">

```



\---



\## Danger Row



```html

<tr class="table-danger">

```



\---



\## Warning Row



```html

<tr class="table-warning">

```



\---



\# Responsive Table



```html

<div class="table-responsive">



<table class="table">



...



</table>



</div>

```



Prevents horizontal overflow on mobile devices.



\---



\# Example Student Table



```html

<div class="table-responsive">



<table

class="table

table-striped

table-hover">



<thead>



<tr>



<th>ID</th>

<th>Name</th>

<th>Course</th>



</tr>



</thead>



<tbody>



<tr>



<td>1</td>

<td>John</td>

<td>Bootstrap</td>



</tr>



<tr>



<td>2</td>

<td>Sarah</td>

<td>React</td>



</tr>



</tbody>



</table>



</div>

```



\---



\# Part 5: Lists



\## What is a List?



Lists organize related information.



Types:



\- Unordered Lists

\- Ordered Lists

\- Description Lists

\- Bootstrap List Groups



\---



\# Unordered List



```html

<ul>



<li>HTML</li>



<li>CSS</li>



<li>Bootstrap</li>



</ul>

```



Output:



```text

• HTML

• CSS

• Bootstrap

```



\---



\# Ordered List



```html

<ol>



<li>Install Bootstrap</li>



<li>Create Layout</li>



<li>Add Components</li>



</ol>

```



Output:



```text

1\. Install Bootstrap

2\. Create Layout

3\. Add Components

```



\---



\# Description List



```html

<dl>



<dt>HTML</dt>

<dd>Markup Language</dd>



<dt>CSS</dt>

<dd>Styling Language</dd>



</dl>

```



\---



\# List Groups



Bootstrap's enhanced list component.



\---



\# Basic List Group



```html

<ul class="list-group">



<li class="list-group-item">

Item 1

</li>



<li class="list-group-item">

Item 2

</li>



<li class="list-group-item">

Item 3

</li>



</ul>

```



\---



\# Active Item



```html

<li

class="list-group-item active">



Dashboard



</li>

```



\---



\# Disabled Item



```html

<li

class="list-group-item disabled">



Coming Soon



</li>

```



\---



\# Colored List Group



```html

<li

class="list-group-item

list-group-item-success">



Success Item



</li>

```



\---



\# Flush List Group



Removes borders and rounded corners.



```html

<ul

class="list-group list-group-flush">

```



\---



\# Numbered List Group



```html

<ol class="list-group list-group-numbered">



<li class="list-group-item">

HTML

</li>



<li class="list-group-item">

CSS

</li>



<li class="list-group-item">

Bootstrap

</li>



</ol>

```



\---



\# Sidebar Navigation Example



```html

<ul class="list-group">



<li

class="list-group-item active">

Dashboard

</li>



<li class="list-group-item">

Users

</li>



<li class="list-group-item">

Settings

</li>



<li class="list-group-item">

Reports

</li>



</ul>

```



\---



\# Mini Project



\## Admin Dashboard Layout



Components Used:



\- Navbar

\- Offcanvas Sidebar

\- Responsive Table

\- Toast Notification



Structure:



```text

Navbar

&#x20;  ↓

Offcanvas Sidebar

&#x20;  ↓

Responsive Table

&#x20;  ↓

Toast Notifications

```



\---



\# Practice Exercise 1



Create a student management page containing:



\- Responsive table

\- Student ID

\- Name

\- Course

\- Status



Use:



```html

table

table-striped

table-hover

```



\---



\# Practice Exercise 2



Create an offcanvas mobile menu with:



\- Home

\- About

\- Services

\- Contact



Add:



```html

offcanvas-start

```



\---



\# Best Practices



\### Modals



\- Keep content concise.

\- Avoid multiple nested modals.

\- Use meaningful titles.



\### Toasts



\- Keep messages short.

\- Auto-hide non-critical notifications.

\- Use semantic colors.



\### Offcanvas



\- Ideal for mobile navigation.

\- Keep menus organized.



\### Tables



\- Always make tables responsive.

\- Use striped rows for readability.

\- Avoid overcrowding data.



\### Lists



\- Use list groups for navigation.

\- Highlight active items.

\- Keep labels concise.



\---



\# Summary



\## Modals



\- Popup dialogs

\- Headers, body, footer

\- Centered and scrollable options



\## Toasts



\- Lightweight notifications

\- Auto-hide support

\- Custom positioning



\## Offcanvas



\- Slide-in sidebars

\- Mobile-friendly navigation

\- Multiple placement options



\## Tables



\- Basic tables

\- Striped tables

\- Hover effects

\- Responsive tables



\## Lists



\- Ordered lists

\- Unordered lists

\- Description lists

\- Bootstrap list groups



These components are essential for building interactive, user-friendly, and responsive Bootstrap applications.

