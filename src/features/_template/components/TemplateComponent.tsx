/**
 * Template Component
 *
 * This is an example feature-specific component.
 * Replace with your actual component implementation.
 */

import React from 'react';
import type { TemplateComponentProps } from '../types';

/**
 * TemplateComponent - Example feature component
 *
 * @param props - Component props
 * @returns JSX element
 */
export const TemplateComponent: React.FC<TemplateComponentProps> = ({
  data,
  onAction,
  className = '',
}) => {
  const handleClick = () => {
    if (onAction) {
      onAction(data.id);
    }
  };

  return (
    <div className={`template-component ${className}`}>
      <h3>{data.name}</h3>
      {data.description && <p>{data.description}</p>}
      {onAction && (
        <button onClick={handleClick} type="button">
          Action
        </button>
      )}
    </div>
  );
};
