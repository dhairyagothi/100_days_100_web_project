import React, { useState } from 'react';
import './navbar.css';

function Navbar({ onTextSelect }) {
  const [openCategory, setOpenCategory] = useState(null);

  const predefinedTexts = {
    headings: ['# Heading 1', '## Heading 2', '### Heading 3'],
    lists: ['- Unordered List', '1. Ordered List'],
    format: ['**Bold Text**', '*Italic Text*'],
    quotingText: ['> Quoted Text'],
    links: ['[Link](https://example.com)'],
    sectionLinks: ['[Section Link](#section)'],
    relativeLinks: ['[Relative Link](./page.html)'],
    customAnchors: ['[Custom Anchor](#anchor)'],
    images: ['![Alt Text](https://via.placeholder.com/150)'],
    taskLists: ['- [ ] Task 1'],
  };

  const toggleDropdown = (category) => {
    // If the category is already open, close it, otherwise open the clicked category
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="navbar">
      {/* Heading Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('headings')}>
          Headings
        </button>
        {openCategory === 'headings' && (
          <div className="dropdown">
            {predefinedTexts.headings.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('lists')}>
          Lists
        </button>
        {openCategory === 'lists' && (
          <div className="dropdown">
            {predefinedTexts.lists.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Format Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('format')}>
          Styling
        </button>
        {openCategory === 'format' && (
          <div className="dropdown">
            {predefinedTexts.format.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quoting Text Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('quotingText')}>
          Quoting Text
        </button>
        {openCategory === 'quotingText' && (
          <div className="dropdown">
            {predefinedTexts.quotingText.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Links Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('links')}>
          Links
        </button>
        {openCategory === 'links' && (
          <div className="dropdown">
            {predefinedTexts.links.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section Links Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('sectionLinks')}>
          Section Links
        </button>
        {openCategory === 'sectionLinks' && (
          <div className="dropdown">
            {predefinedTexts.sectionLinks.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Relative Links Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('relativeLinks')}>
          Relative Links
        </button>
        {openCategory === 'relativeLinks' && (
          <div className="dropdown">
            {predefinedTexts.relativeLinks.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Anchors Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('customAnchors')}>
          Custom Anchors
        </button>
        {openCategory === 'customAnchors' && (
          <div className="dropdown">
            {predefinedTexts.customAnchors.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Images Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('images')}>
          Images
        </button>
        {openCategory === 'images' && (
          <div className="dropdown">
            {predefinedTexts.images.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task Lists Category */}
      <div className="navbar-category">
        <button className="navbar-button" onClick={() => toggleDropdown('taskLists')}>
          Task Lists
        </button>
        {openCategory === 'taskLists' && (
          <div className="dropdown">
            {predefinedTexts.taskLists.map((text, index) => (
              <button key={index} className="dropdown-item" onClick={() => onTextSelect(text)}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
