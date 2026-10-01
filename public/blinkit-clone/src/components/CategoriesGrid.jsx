import React from 'react';
import { categories } from '../data/products';

export default function CategoriesGrid({ activeCategory, onSelectCategory }) {
  return (
    <div className="categories-section">
      <h3 className="section-title">Shop by Category</h3>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            <div className="category-icon-box">
              <span style={{ fontSize: '32px' }}>{category.icon}</span>
            </div>
            <span className="category-label">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
