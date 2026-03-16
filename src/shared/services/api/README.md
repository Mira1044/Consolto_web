# API Service Documentation

## Overview

This directory contains the centralized API client and error handling system for the application. It provides a standardized way to make HTTP requests with automatic error handling, authentication, and response transformation.

## Structure

```
api/
├── apiClient.ts      # Axios instance with interceptors
├── errorHandler.ts   # Centralized error handling
├── index.ts          # Public exports
└── README.md         # This file
```

## Features

- ✅ Automatic authentication token injection
- ✅ Global error handling with user-friendly messages
- ✅ Request/response interceptors
- ✅ Type-safe API requests
- ✅ Standardized error types
- ✅ Automatic retry logic (configurable)
- ✅ Request timeout handling
- ✅ Response transformation

## Usage

### Basic API Request

```typescript
import { apiRequest } from '@/shared/services/api';

// GET request
const data = await apiRequest.get<User[]>('/users');

// POST request
const newUser = await apiRequest.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// PUT request
const updatedUser = await apiRequest.put<User>('/users/1', {
  name: 'Jane Doe',
});

// DELETE request
await apiRequest.delete('/users/1');
```

### With Custom Configuration

```typescript
import { apiRequest } from '@/shared/services/api';
import type { RequestConfig } from '@/shared/services/api';

// Skip authentication (for public endpoints)
const publicData = await apiRequest.get('/public/data', {
  skipAuth: true,
});

// Skip error handler (handle errors manually)
try {
  const data = await apiRequest.get('/endpoint', {
    skipErrorHandler: true,
  });
} catch (error) {
  // Handle error manually
}

// Custom timeout
const data = await apiRequest.get('/slow-endpoint', {
  timeout: 60000, // 60 seconds
});

// Custom headers
const data = await apiRequest.post('/endpoint', payload, {
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

### Error Handling

```typescript
import { apiRequest, AppError, ErrorCode } from '@/shared/services/api';

try {
  const data = await apiRequest.get('/endpoint');
} catch (error) {
  if (error instanceof AppError) {
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
        // Handle unauthorized
        break;
      case ErrorCode.VALIDATION_ERROR:
        // Handle validation errors
        break;
      default:
        // Handle other errors
    }
  }
}
```

### Creating a Service

```typescript
import { apiRequest } from '@/shared/services/api';
import type { ApiResponse } from '@/shared/services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

class UserService {
  private baseUrl = '/users';

  async getAll(): Promise<User[]> {
    const response = await apiRequest.get<ApiResponse<User[]>>(this.baseUrl);
    return Array.isArray(response) ? response : [];
  }

  async getById(id: string): Promise<User> {
    return await apiRequest.get<User>(`${this.baseUrl}/${id}`);
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    return await apiRequest.post<User>(this.baseUrl, user);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    return await apiRequest.put<User>(`${this.baseUrl}/${id}`, user);
  }

  async delete(id: string): Promise<void> {
    await apiRequest.delete(`${this.baseUrl}/${id}`);
  }
}

export const userService = new UserService();
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://api.example.com
```

If not set, defaults to `/api`.

### Authentication

The API client automatically:
1. Reads the auth token from `localStorage` (key: `consolto_user`)
2. Adds `Authorization: Bearer <token>` header if token exists
3. Falls back to `X-User-Email` header if only email is available
4. Redirects to login on 401 errors

### Error Handling

Errors are automatically:
1. Converted to `AppError` instances
2. Logged to console (development)
3. Shown to users (can be integrated with toast notifications)
4. Handled based on error code (e.g., redirect on 401)

## API Response Format

The API client expects responses in this format:

```typescript
{
  data: T,           // The actual data
  message?: string,  // Optional success/error message
  success: boolean,  // Success flag
  errors?: Array<{   // Optional validation errors
    field?: string,
    message: string,
    code?: string,
  }>,
}
```

The interceptor automatically extracts the `data` field, so your service methods receive the typed data directly.

## Error Codes

```typescript
enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

## Best Practices

1. **Always use typed responses**: `apiRequest.get<User[]>('/users')`
2. **Create service classes**: Group related API calls together
3. **Handle errors appropriately**: Use try-catch for custom error handling
4. **Use skipErrorHandler sparingly**: Only when you need custom error handling
5. **Keep baseUrl relative**: Use `/users` not `https://api.example.com/users`

## Integration with Toast Notifications

To integrate with a toast notification system, update `errorHandler.ts`:

```typescript
import { toast } from 'your-toast-library';

export const showErrorToUser = (error: unknown): void => {
  const errorResponse = processError(error);
  toast.error(errorResponse.message);
};
```
