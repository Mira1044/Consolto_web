/**
 * Feature-specific TypeScript types and interfaces
 *
 * Define all types, interfaces, and enums specific to this feature here.
 * Export shared types that might be used by other features or components.
 */

// Example: Entity type
export interface TemplateEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example: Component props type
export interface TemplateComponentProps {
  data: TemplateEntity;
  onAction?: (id: string) => void;
  className?: string;
}

// Example: API response type
export interface TemplateApiResponse {
  success: boolean;
  data: TemplateEntity[];
  message?: string;
}

// Example: Form data type
export interface TemplateFormData {
  name: string;
  description: string;
}

// Example: Hook return type
export interface UseTemplateReturn {
  data: TemplateEntity | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Example: Enum
export enum TemplateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
