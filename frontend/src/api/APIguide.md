# Axios Setup Guide - MVP Edition

## 1. Initial Setup

### App.jsx (One-time setup)
```javascript
// No setup needed! Just import and use api in your components
```

### .env
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=15000
```

---

## 2. Writing API Files

### Pattern: One file per resource

```
src/api/
├── authApi.js      # Login, logout, register
├── userApi.js      # User CRUD
├── productApi.js   # Product operations
└── trackingApi.js  # Analytics/tracking
```

---

## 3. Auth API Template

**Critical**: This is the only API that needs special token handling.

```javascript
// src/api/authApi.js
import { api, setToken, clearToken } from '../axios';

export const authApi = {
  // Login - stores token automatically
  login: async (credentials) => {
    const data = await api.post('/auth/login', credentials);
    setToken(data.token);  // ← Store JWT token
    return data.user;
  },

  // Register
  register: async (userData) => {
    const data = await api.post('/auth/register', userData);
    setToken(data.token);
    return data.user;
  },

  // Logout - clears token
  logout: () => {
    clearToken();
    window.location.href = '/login';
  },
};
```

**Usage:**
```javascript
// Login.jsx
import { authApi } from './api/authApi';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const user = await authApi.login({ email, password });
    navigate('/dashboard');  // Token is now stored
  } catch (error) {
    alert('Login failed');
  }
};
```

---

## 4. Standard API Template

**All other APIs** follow this simple pattern (no token handling needed):

```javascript
// src/api/userApi.js
import { api } from '../axios';

export const userApi = {
  // GET
  getProfile: () => api.get('/users/profile'),
  
  getUser: (id) => api.get(`/users/${id}`),
  
  // GET with query params
  searchUsers: (filters) => api.get('/users/search', { params: filters }),
  
  // POST
  createUser: (data) => api.post('/users', data),
  
  // PUT/PATCH
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  
  // DELETE
  deleteUser: (id) => api.delete(`/users/${id}`),
};
```

---

## 5. Real-World Examples

### User API
```javascript
// src/api/userApi.js
import { api } from '../axios';

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (data) => api.patch('/users/profile', data),
  
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

### Product API
```javascript
// src/api/productApi.js
import { api } from '../axios';

export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  
  getById: (id) => api.get(`/products/${id}`),
  
  create: (product) => api.post('/products', product),
  
  update: (id, product) => api.patch(`/products/${id}`, product),
  
  delete: (id) => api.delete(`/products/${id}`),
};
```

### Tracking API
```javascript
// src/api/trackingApi.js
import { api } from '../axios';

export const trackingApi = {
  logPageView: (page) => 
    api.post('/tracking/pageview', { 
      page, 
      timestamp: Date.now() 
    }),
  
  logEvent: (eventName, metadata = {}) => 
    api.post('/tracking/events', { 
      event: eventName, 
      metadata,
      timestamp: Date.now(),
    }),
};
```

---

## 6. Using APIs in Components

### Basic Usage
```javascript
import { userApi } from '../api/userApi';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await userApi.getProfile();
        setUser(data);
      } catch (error) {
        console.error('Failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
}
```

### With Query Parameters
```javascript
const [products, setProducts] = useState([]);

const fetchProducts = async () => {
  try {
    const data = await productApi.getAll({ 
      category: 'electronics',
      minPrice: 100,
      page: 1,
      limit: 20 
    });
    setProducts(data);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

### Form Submission
```javascript
const handleSubmit = async (formData) => {
  try {
    await userApi.updateProfile(formData);
    alert('Profile updated!');
  } catch (error) {
    alert('Update failed');
  }
};
```

---

## 7. What You Get Automatically

✅ **JWT token attached to all requests** (after login)  
✅ **Response data auto-unwrapped** (no need for `.data`)  
✅ **401 errors redirect to /login** (session expired)  
✅ **Errors logged in development**  

---

## 8. Common Patterns

### Pagination
```javascript
export const postApi = {
  getPosts: ({ page = 1, limit = 20 }) => 
    api.get('/posts', { params: { page, limit } }),
};
```

### Search with Filters
```javascript
export const productApi = {
  search: (filters) => api.get('/products/search', { 
    params: {
      q: filters.query,
      category: filters.category,
      sortBy: filters.sortBy,
    }
  }),
};
```

### File Upload
```javascript
export const fileApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

---

## 9. Testing Your API

### Check JWT in Browser DevTools
1. Login
2. Open DevTools → Network tab
3. Make any API call (e.g., get profile)
4. Check request headers:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Check Token Storage
```javascript
// Browser console
localStorage.getItem('auth_token');
// Should show your JWT token after login
```

---

## 10. Don'ts ❌

```javascript
// ❌ Don't manually add Authorization header
api.get('/users', {
  headers: { Authorization: 'Bearer ...' }  // Already automatic!
});

// ❌ Don't unwrap response.data
const response = await api.get('/users');
const data = response.data;  // Wrong! Already unwrapped

// ❌ Don't store token manually
localStorage.setItem('auth_token', token);  // Use setToken() instead
```

---

## Quick Reference

| Task | Code |
|------|------|
| GET request | `api.get('/users')` |
| GET with params | `api.get('/users', { params: { role: 'admin' } })` |
| POST data | `api.post('/users', userData)` |
| UPDATE data | `api.patch('/users/123', userData)` |
| DELETE | `api.delete('/users/123')` |
| Store token | `setToken(token)` (only in authApi) |
| Clear token | `clearToken()` |

---

## File Structure Example

```
src/
├── api/
│   ├── authApi.js       # Special: handles setToken()
│   ├── userApi.js       # Standard pattern
│   ├── productApi.js    # Standard pattern
│   └── trackingApi.js   # Standard pattern
├── components/
│   ├── Login.jsx        # Uses authApi
│   ├── Profile.jsx      # Uses userApi
│   └── Products.jsx     # Uses productApi
└── axios.js             # Don't modify this
```

**Rule**: Only `authApi.js` calls `setToken()`. Everything else is pure CRUD.
