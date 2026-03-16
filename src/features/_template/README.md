# Feature Template

This is a template feature structure that demonstrates the modular architecture pattern used in this project. Use this as a reference when creating new features.

## 📁 Structure Overview

```
_template/
├── components/          # Feature-specific components
├── hooks/              # Feature-specific custom hooks
├── types/              # Feature-specific TypeScript types
├── utils/              # Feature-specific utility functions
├── services/           # Feature-specific API services
├── index.ts            # Barrel export file
└── README.md           # This file
```

## 🚀 How to Use This Template

1. **Copy the template folder**:
   ```bash
   cp -r src/features/_template src/features/your-feature-name
   ```

2. **Rename files and update content**:
   - Replace `Template` with your feature name
   - Update imports and exports
   - Remove example code and add your feature logic

3. **Follow the patterns**:
   - Components: Use TypeScript, proper prop types, and export from index
   - Hooks: Custom hooks should start with `use` prefix
   - Types: Define interfaces/types in `types/index.ts`
   - Utils: Pure functions, well-documented
   - Services: API calls and data fetching logic

## 📝 Best Practices

- **Keep features self-contained**: All feature-specific code should be within the feature folder
- **Use barrel exports**: Export everything through `index.ts` for clean imports
- **Type everything**: Use TypeScript types for all props, functions, and data
- **Follow naming conventions**:
  - Components: PascalCase (e.g., `UserProfile.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useUserData.ts`)
  - Utils: camelCase (e.g., `formatUserData.ts`)
  - Types: PascalCase (e.g., `UserProfile.ts`)

## 🔗 Importing from Other Features

When importing from other features or shared code:

```typescript
// From shared
import { Button } from '@/shared/components';
import { useLocalStorage } from '@/shared/hooks';

// From other features
import { UserCard } from '@/features/users/components';

// From pages
import { DashboardLayout } from '@/pages/dashboard/components';
```

## 📦 Export Pattern

Always export through `index.ts`:

```typescript
// components/index.ts
export { TemplateComponent } from './TemplateComponent';
export { TemplateCard } from './TemplateCard';

// index.ts (feature root)
export * from './components';
export * from './hooks';
export * from './types';
export * from './utils';
export * from './services';
```
