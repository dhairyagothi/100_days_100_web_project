\# Buttons, Button Groups, Forms, and Form Controls in Bootstrap



\## Introduction



Buttons and forms are among the most frequently used components in web applications.



Bootstrap provides:



\- Beautiful pre-styled buttons

\- Button groups and toolbars

\- Responsive forms

\- Form validation styles

\- Input groups

\- Checkboxes and radio buttons

\- Select menus

\- Floating labels



These components help developers build professional user interfaces quickly.



\---



\# Part 1: Buttons



\## What is a Button?



A button allows users to perform actions such as:



\- Submit forms

\- Open modals

\- Navigate pages

\- Trigger JavaScript events



Basic button:



```html

<button>Click Me</button>

```



Bootstrap enhances buttons with predefined styles.



\---



\# Bootstrap Button Classes



Syntax:



```html

btn btn-color

```



Example:



```html

<button class="btn btn-primary">

&#x20;   Click Me

</button>

```



\---



\# Button Variants



Bootstrap provides several button styles.



\---



\## Primary Button



```html

<button class="btn btn-primary">

&#x20;   Primary

</button>

```



Used for main actions.



\---



\## Secondary Button



```html

<button class="btn btn-secondary">

&#x20;   Secondary

</button>

```



\---



\## Success Button



```html

<button class="btn btn-success">

&#x20;   Success

</button>

```



\---



\## Danger Button



```html

<button class="btn btn-danger">

&#x20;   Delete

</button>

```



\---



\## Warning Button



```html

<button class="btn btn-warning">

&#x20;   Warning

</button>

```



\---



\## Info Button



```html

<button class="btn btn-info">

&#x20;   Info

</button>

```



\---



\## Light Button



```html

<button class="btn btn-light">

&#x20;   Light

</button>

```



\---



\## Dark Button



```html

<button class="btn btn-dark">

&#x20;   Dark

</button>

```



\---



\## Link Button



```html

<button class="btn btn-link">

&#x20;   Link

</button>

```



Looks like a hyperlink.



\---



\# Outline Buttons



Outline buttons have transparent backgrounds.



\---



\## Outline Primary



```html

<button class="btn btn-outline-primary">

&#x20;   Primary

</button>

```



\---



\## Outline Success



```html

<button class="btn btn-outline-success">

&#x20;   Success

</button>

```



\---



\## Outline Danger



```html

<button class="btn btn-outline-danger">

&#x20;   Delete

</button>

```



\---



\# Button Sizes



\---



\## Large Button



```html

<button class="btn btn-primary btn-lg">

&#x20;   Large Button

</button>

```



\---



\## Small Button



```html

<button class="btn btn-primary btn-sm">

&#x20;   Small Button

</button>

```



\---



\# Full Width Button



```html

<div class="d-grid">

&#x20;   <button class="btn btn-primary">

&#x20;       Full Width Button

&#x20;   </button>

</div>

```



\---



\# Disabled Buttons



```html

<button class="btn btn-primary" disabled>

&#x20;   Disabled

</button>

```



\---



\# Active Buttons



```html

<button class="btn btn-success active">

&#x20;   Active Button

</button>

```



\---



\# Button Groups



\## What is a Button Group?



A button group combines multiple buttons into a single horizontal unit.



Example:



```html

<div class="btn-group">



&#x20;   <button class="btn btn-primary">

&#x20;       Left

&#x20;   </button>



&#x20;   <button class="btn btn-primary">

&#x20;       Middle

&#x20;   </button>



&#x20;   <button class="btn btn-primary">

&#x20;       Right

&#x20;   </button>



</div>

```



Output:



```text

\[Left]\[Middle]\[Right]

```



\---



\# Vertical Button Group



```html

<div class="btn-group-vertical">



&#x20;   <button class="btn btn-primary">

&#x20;       Home

&#x20;   </button>



&#x20;   <button class="btn btn-primary">

&#x20;       About

&#x20;   </button>



&#x20;   <button class="btn btn-primary">

&#x20;       Contact

&#x20;   </button>



</div>

```



Output:



```text

Home

About

Contact

```



\---



\# Button Toolbar



```html

<div class="btn-toolbar">



&#x20;   <div class="btn-group me-2">

&#x20;       <button class="btn btn-primary">1</button>

&#x20;       <button class="btn btn-primary">2</button>

&#x20;   </div>



&#x20;   <div class="btn-group">

&#x20;       <button class="btn btn-success">A</button>

&#x20;       <button class="btn btn-success">B</button>

&#x20;   </div>



</div>

```



\---



\# Part 2: Forms



\## What is a Form?



Forms collect user information.



Examples:



\- Login forms

\- Registration forms

\- Contact forms

\- Surveys



Basic form:



```html

<form>

</form>

```



\---



\# Form Structure



```html

<form>



&#x20;   <div class="mb-3">

&#x20;       <label>Name</label>



&#x20;       <input type="text" class="form-control">

&#x20;   </div>



</form>

```



\---



\# Text Input



```html

<input

&#x20;   type="text"

&#x20;   class="form-control"

&#x20;   placeholder="Enter Name">

```



\---



\# Email Input



```html

<input

&#x20;   type="email"

&#x20;   class="form-control"

&#x20;   placeholder="Enter Email">

```



\---



\# Password Input



```html

<input

&#x20;   type="password"

&#x20;   class="form-control"

&#x20;   placeholder="Password">

```



\---



\# Number Input



```html

<input

&#x20;   type="number"

&#x20;   class="form-control">

```



\---



\# Date Input



```html

<input

&#x20;   type="date"

&#x20;   class="form-control">

```



\---



\# Labels



Labels describe form fields.



```html

<label class="form-label">

&#x20;   Email Address

</label>

```



Example:



```html

<label class="form-label">

&#x20;   Email

</label>



<input

&#x20;   type="email"

&#x20;   class="form-control">

```



\---



\# Placeholder Text



```html

<input

&#x20;   type="text"

&#x20;   class="form-control"

&#x20;   placeholder="Enter Username">

```



\---



\# Textarea



Used for larger text input.



```html

<textarea

&#x20;   class="form-control"

&#x20;   rows="4">

</textarea>

```



\---



\# Select Menu



```html

<select class="form-select">



&#x20;   <option>Choose One</option>



&#x20;   <option>HTML</option>



&#x20;   <option>CSS</option>



&#x20;   <option>Bootstrap</option>



</select>

```



\---



\# Checkboxes



```html

<div class="form-check">



&#x20;   <input

&#x20;       class="form-check-input"

&#x20;       type="checkbox">



&#x20;   <label class="form-check-label">

&#x20;       Accept Terms

&#x20;   </label>



</div>

```



\---



\# Multiple Checkboxes



```html

<div class="form-check">

&#x20;   <input class="form-check-input" type="checkbox">

&#x20;   <label class="form-check-label">

&#x20;       HTML

&#x20;   </label>

</div>



<div class="form-check">

&#x20;   <input class="form-check-input" type="checkbox">

&#x20;   <label class="form-check-label">

&#x20;       CSS

&#x20;   </label>

</div>

```



\---



\# Radio Buttons



```html

<div class="form-check">



&#x20;   <input

&#x20;       class="form-check-input"

&#x20;       type="radio"

&#x20;       name="gender">



&#x20;   <label class="form-check-label">

&#x20;       Male

&#x20;   </label>



</div>

```



\---



\# Switches



```html

<div class="form-check form-switch">



&#x20;   <input

&#x20;       class="form-check-input"

&#x20;       type="checkbox">



&#x20;   <label class="form-check-label">

&#x20;       Enable Notifications

&#x20;   </label>



</div>

```



\---



\# Range Slider



```html

<input

&#x20;   type="range"

&#x20;   class="form-range">

```



\---



\# File Upload



```html

<input

&#x20;   type="file"

&#x20;   class="form-control">

```



\---



\# Readonly Input



```html

<input

&#x20;   type="text"

&#x20;   class="form-control"

&#x20;   value="Readonly Value"

&#x20;   readonly>

```



\---



\# Disabled Input



```html

<input

&#x20;   type="text"

&#x20;   class="form-control"

&#x20;   disabled>

```



\---



\# Input Groups



Input groups combine text and form controls.



Example:



```html

<div class="input-group">



&#x20;   <span class="input-group-text">

&#x20;       @

&#x20;   </span>



&#x20;   <input

&#x20;       type="text"

&#x20;       class="form-control">



</div>

```



\---



\# Currency Input



```html

<div class="input-group">



&#x20;   <span class="input-group-text">

&#x20;       $

&#x20;   </span>



&#x20;   <input

&#x20;       type="text"

&#x20;       class="form-control">



</div>

```



\---



\# Floating Labels



Modern form design.



```html

<div class="form-floating">



&#x20;   <input

&#x20;       type="email"

&#x20;       class="form-control"

&#x20;       placeholder="Email">



&#x20;   <label>Email Address</label>



</div>

```



\---



\# Form Validation



\## Valid Input



```html

<input

&#x20;   class="form-control is-valid">

```



\---



\## Invalid Input



```html

<input

&#x20;   class="form-control is-invalid">

```



\---



\# Validation Feedback



```html

<input

&#x20;   class="form-control is-invalid">



<div class="invalid-feedback">

&#x20;   Please enter a valid email.

</div>

```



\---



\# Form Layout Example



\## Registration Form



```html

<form>



&#x20;   <div class="mb-3">



&#x20;       <label class="form-label">

&#x20;           Full Name

&#x20;       </label>



&#x20;       <input

&#x20;           type="text"

&#x20;           class="form-control">



&#x20;   </div>



&#x20;   <div class="mb-3">



&#x20;       <label class="form-label">

&#x20;           Email

&#x20;       </label>



&#x20;       <input

&#x20;           type="email"

&#x20;           class="form-control">



&#x20;   </div>



&#x20;   <div class="mb-3">



&#x20;       <label class="form-label">

&#x20;           Password

&#x20;       </label>



&#x20;       <input

&#x20;           type="password"

&#x20;           class="form-control">



&#x20;   </div>



&#x20;   <button class="btn btn-primary">

&#x20;       Register

&#x20;   </button>



</form>

```



\---



\# Mini Project



\## Login Form



```html

<div class="container mt-5">



&#x20;   <form class="w-50 mx-auto">



&#x20;       <h2 class="mb-4">

&#x20;           Login

&#x20;       </h2>



&#x20;       <div class="mb-3">



&#x20;           <label class="form-label">

&#x20;               Email

&#x20;           </label>



&#x20;           <input

&#x20;               type="email"

&#x20;               class="form-control">



&#x20;       </div>



&#x20;       <div class="mb-3">



&#x20;           <label class="form-label">

&#x20;               Password

&#x20;           </label>



&#x20;           <input

&#x20;               type="password"

&#x20;               class="form-control">



&#x20;       </div>



&#x20;       <button class="btn btn-primary w-100">

&#x20;           Login

&#x20;       </button>



&#x20;   </form>



</div>

```



\---



\# Practice Exercise 1



Create:



\- Name field

\- Email field

\- Password field

\- Submit button



Use:



```html

form-control

btn

btn-primary

```



\---



\# Practice Exercise 2



Create a survey form containing:



\- Text input

\- Radio buttons

\- Checkboxes

\- Select menu

\- Submit button



\---



\# Best Practices



\### Always use labels.



\### Validate user input.



\### Use meaningful button colors.



Examples:



```text

Success → Save

Danger → Delete

Primary → Main Action

```



\### Group related form elements.



\### Keep forms simple and easy to understand.



\### Use placeholders only as hints, not replacements for labels.



\---



\# Summary



Bootstrap Buttons and Forms provide:



\## Buttons



\- Standard buttons

\- Outline buttons

\- Button sizes

\- Button groups

\- Toolbars

\- Full-width buttons



\## Forms



\- Text inputs

\- Email and password fields

\- Textareas

\- Select menus

\- Checkboxes

\- Radio buttons

\- Switches

\- File uploads

\- Input groups

\- Floating labels

\- Validation utilities



These components form the foundation of user interaction in Bootstrap applications.

