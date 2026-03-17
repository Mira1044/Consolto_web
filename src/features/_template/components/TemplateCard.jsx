/**
 * Template Card Component
 *
 * Another example component showing how to structure feature components.
 */

import React from 'react';

/**
 * TemplateCard - Displays a card for a template entity
 */
export const TemplateCard = ({ item, onClick }) => {
  return (
    <div
      className="template-card"
      onClick={() => onClick?.(item.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(item.id);
        }
      }}
    >
      <div className="template-card-header">
        <h4>{item.name}</h4>
      </div>
      <div className="template-card-body">
        {item.description && <p>{item.description}</p>}
      </div>
      <div className="template-card-footer">
        <span>Created: {item.createdAt.toLocaleDateString()}</span>
      </div>
    </div>
  );
};
