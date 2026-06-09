\# Bootstrap Grid System



\## Introduction



The Bootstrap Grid System is a powerful layout system built using \*\*Flexbox\*\*. It helps developers create responsive and structured web pages by dividing the page into rows and columns.



Bootstrap uses a \*\*12-column grid layout\*\*, allowing flexible content arrangement across different screen sizes.



\---



\## Why Use the Grid System?



\- Creates responsive layouts easily

\- Reduces custom CSS requirements

\- Supports all screen sizes

\- Uses Flexbox for alignment and spacing

\- Makes page structure organized and maintainable



\---



\## Grid Structure



A Bootstrap grid follows this hierarchy:



```html

<div class="container">

&#x20;   <div class="row">

&#x20;       <div class="col">

&#x20;           Content

&#x20;       </div>

&#x20;   </div>

</div>

```



\### Components



| Component | Purpose |

|------------|----------|

| container | Main wrapper |

| row | Horizontal group of columns |

| col | Individual content area |



\---



\## The 12-Column System



Bootstrap divides each row into \*\*12 equal columns\*\*.



Example:



```html

<div class="row">

&#x20;   <div class="col-4">Column 1</div>

&#x20;   <div class="col-4">Column 2</div>

&#x20;   <div class="col-4">Column 3</div>

</div>

```



Visualization:



```text

|----4----|----4----|----4----|

```



Total = 12



\---



\## Equal Width Columns



Bootstrap automatically distributes available space.



```html

<div class="row">

&#x20;   <div class="col">Column 1</div>

&#x20;   <div class="col">Column 2</div>

&#x20;   <div class="col">Column 3</div>

</div>

```



Result:



```text

|----4----|----4----|----4----|

```



\---



\## Specifying Column Widths



You can define exact widths.



```html

<div class="row">

&#x20;   <div class="col-3">25%</div>

&#x20;   <div class="col-6">50%</div>

&#x20;   <div class="col-3">25%</div>

</div>

```



Result:



```text

|---3---|------6------|---3---|

```



\---



\## Responsive Grid Classes



Bootstrap provides responsive breakpoints.



| Class | Screen Size |

|---------|------------|

| col-sm-\* | ≥ 576px |

| col-md-\* | ≥ 768px |

| col-lg-\* | ≥ 992px |

| col-xl-\* | ≥ 1200px |

| col-xxl-\* | ≥ 1400px |



Example:



```html

<div class="row">

&#x20;   <div class="col-sm-12 col-md-6 col-lg-4">

&#x20;       Responsive Column

&#x20;   </div>

</div>

```



Behavior:



\- Mobile → 100%

\- Tablet → 50%

\- Desktop → 33.33%



\---



\## Multiple Responsive Columns



```html

<div class="row">

&#x20;   <div class="col-md-4">Column 1</div>

&#x20;   <div class="col-md-4">Column 2</div>

&#x20;   <div class="col-md-4">Column 3</div>

</div>

```



On small devices:



```text

Column 1

Column 2

Column 3

```



On medium and larger devices:



```text

|----4----|----4----|----4----|

```



\---



\## Auto Layout Columns



Bootstrap automatically sizes columns.



```html

<div class="row">

&#x20;   <div class="col">Column A</div>

&#x20;   <div class="col">Column B</div>

</div>

```



Result:



```text

|------6------|------6------|

```



\---



\## Mixed Layout Example



```html

<div class="row">

&#x20;   <div class="col-2">Sidebar</div>

&#x20;   <div class="col-8">Main Content</div>

&#x20;   <div class="col-2">Ads</div>

</div>

```



Visualization:



```text

|--2--|------8------|--2--|

```



\---



\## Nested Grids



A column can contain another row.



```html

<div class="container">

&#x20;   <div class="row">

&#x20;       <div class="col-8">

&#x20;           Parent Column



&#x20;           <div class="row">

&#x20;               <div class="col-6">Nested 1</div>

&#x20;               <div class="col-6">Nested 2</div>

&#x20;           </div>



&#x20;       </div>



&#x20;       <div class="col-4">

&#x20;           Sidebar

&#x20;       </div>

&#x20;   </div>

</div>

```



\---



\## Column Offsets



Offsets create empty space before columns.



```html

<div class="row">

&#x20;   <div class="col-4 offset-4">

&#x20;       Centered Content

&#x20;   </div>

</div>

```



Visualization:



```text

|----empty----|---4---|

```



\---



\## Ordering Columns



Change display order without changing HTML.



```html

<div class="row">

&#x20;   <div class="col order-2">First</div>

&#x20;   <div class="col order-1">Second</div>

</div>

```



Displayed order:



```text

Second

First

```



\---



\## Horizontal Alignment



\### Center Columns



```html

<div class="row justify-content-center">

&#x20;   <div class="col-4">

&#x20;       Centered Column

&#x20;   </div>

</div>

```



\### End Alignment



```html

<div class="row justify-content-end">

&#x20;   <div class="col-4">

&#x20;       Right Side

&#x20;   </div>

</div>

```



\---



\## Vertical Alignment



```html

<div class="row align-items-center" style="height:200px;">

&#x20;   <div class="col">

&#x20;       Vertically Centered

&#x20;   </div>

</div>

```



Options:



\- align-items-start

\- align-items-center

\- align-items-end



\---



\## Gutters (Spacing Between Columns)



Bootstrap provides gutter utilities.



```html

<div class="row g-3">

&#x20;   <div class="col">

&#x20;       Column 1

&#x20;   </div>



&#x20;   <div class="col">

&#x20;       Column 2

&#x20;   </div>

</div>

```



Common values:



| Class | Spacing |

|---------|----------|

| g-0 | No gap |

| g-1 | Small |

| g-3 | Medium |

| g-5 | Large |



\---



\## Real-World Example: Three-Column Layout



```html

<div class="container">



&#x20;   <div class="row">



&#x20;       <div class="col-lg-3">

&#x20;           Sidebar

&#x20;       </div>



&#x20;       <div class="col-lg-6">

&#x20;           Main Content

&#x20;       </div>



&#x20;       <div class="col-lg-3">

&#x20;           Ads

&#x20;       </div>



&#x20;   </div>



</div>

```



Desktop:



```text

|Sidebar| Main Content | Ads |

```



Mobile:



```text

Sidebar

Main Content

Ads

```



\---



\## Best Practices



\### 1. Always Use Rows Inside Containers



Correct:



```html

<div class="container">

&#x20;   <div class="row">

&#x20;       <div class="col">Content</div>

&#x20;   </div>

</div>

```



\### 2. Keep Column Total ≤ 12



Good:



```html

col-4 + col-4 + col-4 = 12

```



Bad:



```html

col-6 + col-6 + col-4 = 16

```



\### 3. Use Responsive Classes



Prefer:



```html

col-sm-12 col-md-6 col-lg-4

```



instead of fixed:



```html

col-4

```



\---



\## Practice Exercise 1



Create:



```text

| Header |

| Sidebar | Content |

| Footer |

```



Hint:



```html

container

row

col-12

col-3

col-9

```



\---



\## Practice Exercise 2



Create a four-column layout on desktop and single-column layout on mobile.



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



\---



\## Summary



The Bootstrap Grid System:



\- Uses a 12-column structure

\- Is based on Flexbox

\- Supports responsive layouts

\- Uses containers, rows, and columns

\- Allows nesting, offsets, ordering, and alignment

\- Makes website layouts fast and efficient



Mastering the Grid System is the foundation for building responsive Bootstrap websites.

