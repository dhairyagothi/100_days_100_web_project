\# Containers, Rows, and Columns in Bootstrap



\## Introduction



Bootstrap layouts are built using three fundamental components:



1\. \*\*Containers\*\*

2\. \*\*Rows\*\*

3\. \*\*Columns\*\*



These components work together to create responsive and organized page structures.



The hierarchy is:



```html

<div class="container">

&#x20;   <div class="row">

&#x20;       <div class="col">

&#x20;           Content

&#x20;       </div>

&#x20;   </div>

</div>

```



Think of it as:



```text

Container

&#x20;└── Row

&#x20;     └── Column

```



\---



\# 1. Containers



\## What is a Container?



A container is the outermost wrapper that provides spacing and alignment for page content.



Containers:



\- Center content on the page

\- Add horizontal padding

\- Control layout width

\- Hold rows and columns



\---



\## Types of Containers



Bootstrap provides three main container types.



\### 1. `.container`



Responsive fixed-width container.



```html

<div class="container">

&#x20;   Content Here

</div>

```



Width changes according to screen size.



Example:



| Screen Size | Container Width |

|------------|----------------|

| Small | 100% |

| Medium | 720px |

| Large | 960px |

| Extra Large | 1140px |

| XXL | 1320px |



\---



\### 2. `.container-fluid`



Always takes 100% width.



```html

<div class="container-fluid">

&#x20;   Full Width Content

</div>

```



Visualization:



```text

\-----------------------------------------

|          Full Width Area              |

\-----------------------------------------

```



Useful for:



\- Dashboards

\- Hero sections

\- Full-width banners



\---



\### 3. Responsive Containers



Bootstrap allows containers that become fluid below specific breakpoints.



Examples:



```html

<div class="container-sm">

```



```html

<div class="container-md">

```



```html

<div class="container-lg">

```



```html

<div class="container-xl">

```



```html

<div class="container-xxl">

```



Example:



```html

<div class="container-lg">

&#x20;   Content

</div>

```



Behavior:



\- Fluid on smaller screens

\- Fixed width on large screens and above



\---



\# Container Examples



\## Fixed Width Container



```html

<div class="container">

&#x20;   <h2>Welcome</h2>

&#x20;   <p>Bootstrap Layout Example</p>

</div>

```



\---



\## Fluid Container



```html

<div class="container-fluid bg-primary text-white">

&#x20;   <h1>Full Width Banner</h1>

</div>

```



\---



\# 2. Rows



\## What is a Row?



Rows create horizontal groups of columns.



A row acts like a horizontal section where columns are placed.



```html

<div class="row">

&#x20;   <div class="col">

&#x20;       Column

&#x20;   </div>

</div>

```



\---



\## Why Rows Are Important



Rows:



\- Organize columns

\- Maintain spacing

\- Control alignment

\- Use Flexbox internally



Without rows, columns will not behave correctly.



\---



\## Basic Row Example



```html

<div class="container">



&#x20;   <div class="row">



&#x20;       <div class="col">

&#x20;           Column 1

&#x20;       </div>



&#x20;       <div class="col">

&#x20;           Column 2

&#x20;       </div>



&#x20;   </div>



</div>

```



Output:



```text

| Column 1 | Column 2 |

```



\---



\## Multiple Rows



```html

<div class="container">



&#x20;   <div class="row">

&#x20;       <div class="col">

&#x20;           Header

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="row">

&#x20;       <div class="col">

&#x20;           Main Content

&#x20;       </div>

&#x20;   </div>



</div>

```



Output:



```text

Header



Main Content

```



\---



\# Row Alignment



Rows use Flexbox utilities.



\---



\## Horizontal Center



```html

<div class="row justify-content-center">

&#x20;   <div class="col-4">

&#x20;       Centered Column

&#x20;   </div>

</div>

```



\---



\## Align to Start



```html

<div class="row justify-content-start">

```



\---



\## Align to End



```html

<div class="row justify-content-end">

```



\---



\## Space Between



```html

<div class="row justify-content-between">

```



Output:



```text

Column 1                 Column 2

```



\---



\# Vertical Alignment in Rows



\---



\## Center Vertically



```html

<div class="row align-items-center">

```



\---



\## Align Top



```html

<div class="row align-items-start">

```



\---



\## Align Bottom



```html

<div class="row align-items-end">

```



\---



\# 3. Columns



\## What is a Column?



Columns are content areas inside rows.



Bootstrap uses a 12-column system.



Example:



```html

<div class="row">



&#x20;   <div class="col-6">

&#x20;       Left

&#x20;   </div>



&#x20;   <div class="col-6">

&#x20;       Right

&#x20;   </div>



</div>

```



Output:



```text

|------Left------|------Right------|

```



\---



\# Equal Width Columns



Bootstrap automatically divides available space.



```html

<div class="row">



&#x20;   <div class="col">

&#x20;       1

&#x20;   </div>



&#x20;   <div class="col">

&#x20;       2

&#x20;   </div>



&#x20;   <div class="col">

&#x20;       3

&#x20;   </div>



</div>

```



Output:



```text

|----1----|----2----|----3----|

```



\---



\# Specific Width Columns



You can define exact widths.



```html

<div class="row">



&#x20;   <div class="col-3">

&#x20;       Sidebar

&#x20;   </div>



&#x20;   <div class="col-9">

&#x20;       Content

&#x20;   </div>



</div>

```



Output:



```text

|--Sidebar--|------Content------|

```



\---



\# Responsive Columns



Bootstrap allows different widths for different screens.



```html

<div class="col-sm-12 col-md-6 col-lg-4">

```



Behavior:



| Device | Width |

|----------|--------|

| Mobile | 100% |

| Tablet | 50% |

| Desktop | 33.33% |



\---



\# Multiple Responsive Columns



```html

<div class="row">



&#x20;   <div class="col-md-4">

&#x20;       Item 1

&#x20;   </div>



&#x20;   <div class="col-md-4">

&#x20;       Item 2

&#x20;   </div>



&#x20;   <div class="col-md-4">

&#x20;       Item 3

&#x20;   </div>



</div>

```



Desktop:



```text

| Item1 | Item2 | Item3 |

```



Mobile:



```text

Item1



Item2



Item3

```



\---



\# Auto-Sized Columns



Bootstrap can size columns automatically.



```html

<div class="row">



&#x20;   <div class="col">

&#x20;       Flexible

&#x20;   </div>



&#x20;   <div class="col-auto">

&#x20;       Auto Width

&#x20;   </div>



</div>

```



`col-auto` adjusts width according to content.



\---



\# Nested Columns



Columns can contain additional rows and columns.



```html

<div class="container">



&#x20;   <div class="row">



&#x20;       <div class="col-8">



&#x20;           Parent Column



&#x20;           <div class="row">



&#x20;               <div class="col-6">

&#x20;                   Child 1

&#x20;               </div>



&#x20;               <div class="col-6">

&#x20;                   Child 2

&#x20;               </div>



&#x20;           </div>



&#x20;       </div>



&#x20;       <div class="col-4">

&#x20;           Sidebar

&#x20;       </div>



&#x20;   </div>



</div>

```



\---



\# Offsetting Columns



Offsets create empty space.



```html

<div class="row">



&#x20;   <div class="col-4 offset-4">

&#x20;       Centered Box

&#x20;   </div>



</div>

```



Visualization:



```text

|----empty----| Centered Box |

```



\---



\# Ordering Columns



Change display order.



```html

<div class="row">



&#x20;   <div class="col order-2">

&#x20;       First

&#x20;   </div>



&#x20;   <div class="col order-1">

&#x20;       Second

&#x20;   </div>



</div>

```



Displayed:



```text

Second

First

```



\---



\# Gutters (Spacing)



Gutters are spaces between columns.



```html

<div class="row g-4">



&#x20;   <div class="col">

&#x20;       Box 1

&#x20;   </div>



&#x20;   <div class="col">

&#x20;       Box 2

&#x20;   </div>



</div>

```



Common classes:



| Class | Gap Size |

|---------|---------|

| g-0 | None |

| g-1 | Small |

| g-3 | Medium |

| g-5 | Large |



\---



\# Real-World Layout Example



\## Blog Layout



```html

<div class="container">



&#x20;   <div class="row">



&#x20;       <div class="col-lg-8">

&#x20;           Blog Posts

&#x20;       </div>



&#x20;       <div class="col-lg-4">

&#x20;           Sidebar

&#x20;       </div>



&#x20;   </div>



</div>

```



Desktop:



```text

| Blog Posts | Sidebar |

```



Mobile:



```text

Blog Posts



Sidebar

```



\---



\# Common Mistakes



\## Incorrect Structure



❌ Wrong



```html

<div class="container">

&#x20;   <div class="col">

&#x20;       Content

&#x20;   </div>

</div>

```



\---



\## Correct Structure



✅ Right



```html

<div class="container">



&#x20;   <div class="row">



&#x20;       <div class="col">

&#x20;           Content

&#x20;       </div>



&#x20;   </div>



</div>

```



\---



\# Best Practices



\### Always place columns inside rows.



\### Always place rows inside containers.



\### Use responsive classes whenever possible.



\### Keep total column count within 12.



\### Use gutters instead of custom margins where possible.



\### Prefer Bootstrap layout utilities before writing custom CSS.



\---



\# Practice Exercise 1



Create this layout:



```text

\-------------------

|     Header      |

\-------------------

| Sidebar | Main  |

\-------------------

|   Footer        |

\-------------------

```



Hint:



```html

col-12

col-3

col-9

```



\---



\# Practice Exercise 2



Create a four-column layout that becomes a single column on mobile.



Expected:



Desktop:



```text

|1|2|3|4|

```



Mobile:



```text

1

2

3

4

```



Use:



```html

col-md-3

```



\---



\# Summary



Containers, Rows, and Columns form the backbone of Bootstrap layouts.



\- Containers wrap content

\- Rows organize horizontal sections

\- Columns hold actual content

\- Bootstrap uses a 12-column responsive grid

\- Rows and columns rely on Flexbox

\- Responsive classes adapt layouts automatically



Mastering these three components is essential before learning other Bootstrap components such as Cards, Forms, Navbars, and Responsive Design.

