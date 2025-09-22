# Redux Store with RTK Query

This directory contains the Redux store setup using Redux Toolkit and RTK Query for efficient API state management.

## Structure

- `index.ts` - Main store configuration with RTK Query middleware
- `hooks.ts` - Typed Redux hooks
- `ReduxProvider.tsx` - Redux provider component
- `slices/authSlice.ts` - Authentication slice for local state
- `api/authApi.ts` - RTK Query API slice for authentication endpoints

## RTK Query Features

### 🚀 **Built-in Features**
- **Automatic Caching** - Responses are cached automatically
- **Loading States** - Built-in loading, error, and success states
- **Optimistic Updates** - Update UI before server response
- **Background Refetching** - Automatic data refetching
- **Request Deduplication** - Prevents duplicate requests

### 🔐 **Authentication API Endpoints**

#### Login
```tsx
const [login, { isLoading, error }] = useLoginMutation();

const handleLogin = async (credentials) => {
  try {
    const result = await login(credentials).unwrap();
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

#### Logout
```tsx
const [logout, { isLoading }] = useLogoutMutation();

const handleLogout = async () => {
  try {
    await logout().unwrap();
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

#### Get Current User
```tsx
const { data: user, isLoading, error } = useGetCurrentUserQuery();
```

## Backend Integration

### Login Controller Integration
- **Endpoint**: `POST /auth/login`
- **Request**: `{ email: string, password: string }`
- **Response**: `{ user: User, accessToken: string }`
- **Features**: 
  - Validates credentials
  - Generates JWT tokens
  - Sets refresh token as HTTP-only cookie
  - Returns user data and access token

### Logout Controller Integration
- **Endpoint**: `POST /auth/logout`
- **Request**: None (uses cookies)
- **Response**: `{ message: string }`
- **Features**:
  - Clears refresh token from database
  - Removes HTTP-only cookie
  - Returns success status

## State Management

### Auth Slice (Local State)
```tsx
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
```

### RTK Query Cache
- **Tags**: `['User', 'Auth']` for cache invalidation
- **Automatic Invalidation**: Login/logout invalidates relevant cache
- **Background Updates**: Automatic refetching when needed

## Usage Examples

### Login Component
```tsx
import { useLoginMutation } from '@/store/api/authApi';

function LoginForm() {
  const [login, { isLoading, error }] = useLoginMutation();
  
  const handleSubmit = async (data) => {
    try {
      await login(data).unwrap();
      // Success - user is logged in
    } catch (error) {
      // Handle error
    }
  };
}
```

### Logout Component
```tsx
import { useLogoutMutation } from '@/store/api/authApi';

function LogoutButton() {
  const [logout, { isLoading }] = useLogoutMutation();
  
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Success - user is logged out
    } catch (error) {
      // Handle error
    }
  };
}
```

### Protected Route
```tsx
import { useAppSelector } from '@/store/hooks';

function ProtectedComponent() {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <LoginRedirect />;
  }
  
  return <Dashboard user={user} />;
}
```

## API Configuration

The API configuration is centralized in `src/constants/constants.js`:

```javascript
export const BASE_URL = "https://formapi.stocksigo.com";
//  export const BASE_URL = 'https://paecapi.saasa.shop'

export const AUTH_URL = "/api/v1/auth";

export const USERS_URL = "/api/v1/users";

export const PATIENT_URL = "/api/v1/baseline";
export const GHD_URL = "/api/v1/followup";
export const CENTER_URL = "/api/v1/centres";
export const COLLABORATING_CENTER_URL = "/api/v1/collaborating-centres";
export const REPORTING_CENTER_URL = "/api/v1/reporting-centres";
export const LOGS_URL = "/api/logs";
export const IMPORT_URL = "/api/v1/import";
export const EXPORT_URL = "/api/export";

// OCR URL and Paths
export const OCR_API_URL = "http://formai.stocksigo.com";
export const EXTRACT_DATA_FROM_IMAGE = "/extractapi/image";
export const EXTRACT_DATA_FROM_PDF = "/extractapi/pdf";
```

### API Endpoints

All API endpoints are defined in constants for consistency:

- **Authentication**: `${AUTH_URL}/login`, `${AUTH_URL}/logout`, `${AUTH_URL}/refresh_token`, `${AUTH_URL}/me`
- **Users**: `${USERS_URL}`
- **Patients**: `${PATIENT_URL}`
- **Follow-up**: `${GHD_URL}`
- **Centers**: `${CENTER_URL}`, `${COLLABORATING_CENTER_URL}`, `${REPORTING_CENTER_URL}`
- **Import/Export**: `${IMPORT_URL}`, `${EXPORT_URL}`
- **OCR**: `${OCR_API_URL}${EXTRACT_DATA_FROM_IMAGE}`, `${OCR_API_URL}${EXTRACT_DATA_FROM_PDF}`

## Key Benefits

1. **Type Safety** - Full TypeScript support
2. **Automatic Caching** - No manual cache management
3. **Loading States** - Built-in loading indicators
4. **Error Handling** - Comprehensive error management
5. **Optimistic Updates** - Better UX with immediate feedback
6. **Background Sync** - Automatic data synchronization
7. **Request Deduplication** - Prevents unnecessary API calls

## Migration from Async Thunks

The migration from async thunks to RTK Query provides:
- **Simpler Code** - Less boilerplate
- **Better Performance** - Automatic caching and deduplication
- **Enhanced UX** - Built-in loading and error states
- **Easier Testing** - Mocked API responses
- **Better DevTools** - Enhanced debugging capabilities