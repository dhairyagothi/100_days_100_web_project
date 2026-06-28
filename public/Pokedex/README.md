# 🎮 Pokédex

> A modern, responsive Pokédex web application powered by the
> **PokéAPI**.

------------------------------------------------------------------------

# Table of Contents

1.  Introduction
2.  Features
3.  Technologies
4.  Project Structure
5.  Installation
6.  Usage
7.  Search Functionality
8.  Pokémon Information
9.  API Integration
10. Responsive Design
11. Accessibility
12. JavaScript Concepts
13. Code Flow
14. Future Improvements
15. Contributing
16. License
17. Author
18. Acknowledgements
19. FAQ
20. Changelog

------------------------------------------------------------------------

# 1. Introduction

The Pokédex is an interactive web application built using HTML, CSS, and
JavaScript.

Users can search Pokémon by **name** or **Pokédex ID** and instantly
retrieve official artwork, descriptions, elemental types, and base
statistics.

The project consumes data directly from the public PokéAPI.

------------------------------------------------------------------------

# 2. Features

-   Search by Pokémon name
-   Search by Pokédex ID
-   Official artwork
-   English description
-   Dynamic type badges
-   Base stats
-   Responsive layout
-   Error handling
-   Fast loading
-   Default Pikachu on startup
-   Simple UI
-   Modern design

------------------------------------------------------------------------

# 3. Technologies

-   HTML5
-   CSS3
-   JavaScript (ES6)
-   Fetch API
-   PokéAPI

------------------------------------------------------------------------

# 4. Folder Structure

``` text
Pokedex/
├── index.html
├── style.css
├── script.js
├── image.png
└── README.md
```

------------------------------------------------------------------------

# 5. Installation

``` bash
git clone https://github.com/100_days_100_project.git
cd Pokedex
```

Open **index.html**.

------------------------------------------------------------------------

# 6. Usage

1.  Open the application.
2.  Enter a Pokémon name or ID.
3.  Press Search or Enter.
4.  Explore the results.

------------------------------------------------------------------------

# 7. Search Functionality

The application accepts:

-   Pikachu
-   Charizard
-   Bulbasaur
-   1
-   25
-   150

Invalid names display a friendly error.

------------------------------------------------------------------------

# 8. Pokémon Information

Each search displays:

-   Name
-   National Dex Number
-   Artwork
-   Description
-   Types
-   Base Stats

------------------------------------------------------------------------

# 9. API Integration

Endpoints used:

    https://pokeapi.co/api/v2/pokemon/{name_or_id}

    https://pokeapi.co/api/v2/pokemon-species/{name_or_id}

Data is fetched asynchronously.

------------------------------------------------------------------------

# 10. Responsive Design

Optimized for:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

------------------------------------------------------------------------

# 11. Accessibility

-   Keyboard search
-   Semantic HTML
-   Descriptive alt text
-   Readable typography

------------------------------------------------------------------------

# 12. JavaScript Concepts

-   Async/Await
-   Fetch API
-   Promises
-   DOM Manipulation
-   Event Listeners
-   Array Mapping
-   Error Handling

------------------------------------------------------------------------

# 13. Code Flow

1.  User enters query.
2.  Fetch request sent.
3.  JSON parsed.
4.  UI rendered.
5.  Errors handled.

------------------------------------------------------------------------

# 14. Future Improvements

-   Favorites
-   Evolution chain
-   Abilities
-   Moves
-   Dark mode
-   Compare Pokémon
-   Infinite search history
-   Voice search
-   Random Pokémon
-   Shiny toggle

------------------------------------------------------------------------

# 15. Contributing

1.  Fork
2.  Create branch
3.  Commit
4.  Push
5.  Open Pull Request

------------------------------------------------------------------------

# 16. License

MIT License.

------------------------------------------------------------------------

# 17. Author

**@madhavcodes25**

------------------------------------------------------------------------

# 18. Acknowledgements

-   PokéAPI
-   Pokémon
-   Open-source community

------------------------------------------------------------------------

# 19. FAQ

**Q:** Can I search by ID?

Yes.

**Q:** Does it require installation?

No.

**Q:** Is it responsive?

Yes.

------------------------------------------------------------------------

# 20. Changelog

## v1.0.0

-   Initial release
-   Search
-   Stats
-   Descriptions
-   Responsive UI

------------------------------------------------------------------------
