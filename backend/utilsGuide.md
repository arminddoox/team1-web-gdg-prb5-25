# 🧩 utilsGuide.md
**Project:** MealMaster Backend (Express + Mongoose)  
**Scope:** 2-person team — compact version of `utils.js`

---

## 🧱 Overview
`utils.js` is our **shared toolbox**.  
It holds small, *reusable, and framework-agnostic* helpers used by controllers, services, and routes.

Keep this file **under 200 lines** — if it grows too big, split it into `/utils/` folder later.

---

## ⚙️ Imports
Always import only what you need:
```js
import { asyncHandler, ApiError, respondSuccess } from '../utils.js';
````

---

## 🧠 Core Sections

### 1. Logger

Use for consistent console outputs (auto-hides debug in production):

```js
import { logger } from '../utils.js';

logger.info('Server started');
logger.warn('Low disk space');
logger.error('Database connection failed');
logger.debug('User payload:', payload);
```

---

### 2. ApiError (Custom Error)

Throw in controllers/services when something is invalid:

```js
import { ApiError } from '../utils.js';

if (!email) throw new ApiError(400, 'Email is required');
throw new ApiError(404, 'User not found');
```

Your error middleware will catch this and send a formatted response automatically.

---

### 3. asyncHandler

Wrap async Express routes — no need for try/catch everywhere:

```js
import { asyncHandler } from '../utils.js';

router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(user);
}));
```

---

### 4. respondSuccess / respondError

Standardized responses for API endpoints:

```js
import { respondSuccess, respondError } from '../utils.js';

respondSuccess(res, { user });
respondError(res, 403, 'Unauthorized access');
```

Keeps all responses consistent with the `{ status, data, meta }` format.

---

### 5. Password Helpers

Hash and compare passwords using bcrypt:

```js
import { hashPassword, comparePassword } from '../utils.js';

const hashed = await hashPassword('secret');
const valid = await comparePassword('secret', hashed);
```

---

### 6. JWT Helpers

Sign and verify JSON Web Tokens:

```js
import { signToken, verifyToken } from '../utils.js';

const token = signToken({ id: user._id });
const payload = verifyToken(token); // throws ApiError if invalid
```

Automatically uses `JWT_SECRET` and `JWT_EXPIRES_IN` from `configs.js`.

---

### 7. Object Helpers

Shape MongoDB results cleanly:

```js
import { pick, omit } from '../utils.js';

pick(user, ['_id', 'email']); // select only some keys
omit(user, ['password']);     // remove sensitive fields
```

---

### 8. Misc Tools

```js
import { uid, safeJsonParse, sleep, retry } from '../utils.js';

const id = uid('user_');                  // user_abcxyz123
const obj = safeJsonParse('{bad}', {});   // safely parse JSON
await sleep(500);                         // small delay
await retry(() => fetchData(), 3);        // retry 3 times
```

---

## 🧩 Team Rules

1. **Use what exists** — don’t reimplement helpers.
2. **Keep it pure** — no direct access to `req`, `res`, or database logic inside utils.
3. **Add only shared logic** that benefits multiple files.
4. **Prefix new helpers with a comment block** if you add one, e.g.:

   ```js
   // ---------- New: email validation ----------
   export const isEmail = (str) => /@/.test(str);
   ```
5. **Split into `/utils/` folder** once it grows beyond ~200 lines.

---

## ✅ Quick Reference

| Category  | Function                                                      | Purpose                 |
| --------- | ------------------------------------------------------------- | ----------------------- |
| Logging   | `logger.info`, `logger.warn`, `logger.error`, `logger.debug`  | Console output          |
| Errors    | `ApiError`                                                    | Throw structured errors |
| Async     | `asyncHandler`                                                | Wrap async routes       |
| Responses | `respondSuccess`, `respondError`                              | Unified JSON responses  |
| Auth      | `hashPassword`, `comparePassword`, `signToken`, `verifyToken` | Auth helpers            |
| Objects   | `pick`, `omit`                                                | Filter object keys      |
| Misc      | `uid`, `safeJsonParse`, `sleep`, `retry`                      | Common utilities        |

---

**Keep it small. Keep it clean.**
`utils.js` is meant to *save typing, not hide logic.*
If you need more than 200 lines — it’s time for a `/utils/` folder.