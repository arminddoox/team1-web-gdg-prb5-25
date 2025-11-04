Great 👍 — here’s your **mini version** — a condensed `utils-readme.md` you can drop right beside `utils.js` for quick developer reference (ideal for small teams who don’t want to read long docs).

---

# 🧩 utils.js Quick Guide

> Small, shared helper functions for the frontend.  
> Keep it **pure, framework-agnostic, and short**.  
> Split into `/utils/` folder only when this file grows too big.

---

## ⚙️ Structure Overview

| Section | Description | Examples |
|----------|--------------|-----------|
| **Env & Debug** | Detect browser, log safely | `isBrowser`, `logger.log()` |
| **Classnames** | Tailwind-friendly combine | `cx("base", { active: isActive })` |
| **Performance** | Control frequency of handlers | `debounce(fn, 300)`, `throttle(fn, 200)` |
| **Storage** | JSON-safe localStorage wrapper | `storage.get("key")` |
| **Date & Time** | Basic formatting & relative time | `formatDate(date)`, `timeAgo(date)` |
| **Query Utils** | Parse/build query strings | `buildQuery(obj)`, `parseQuery("?x=1")` |
| **Misc** | Small universal helpers | `uid()`, `validateEmail()`, `assert()` |

---

## 🧠 Usage Examples

### Logging
```js
logger.log("Debug message only in dev mode");
logger.error("Something went wrong");
```

### Classnames

```js
cx("btn", { "btn-primary": active, "btn-disabled": !active });
```

### Debounce / Throttle

```js
const onInput = debounce(e => console.log(e.target.value), 400);
window.addEventListener("scroll", throttle(() => console.log("scroll"), 200));
```

### Storage

```js
storage.set("user", { name: "Armin" });
const user = storage.get("user");
storage.remove("user");
```

### Date / Time

```js
formatDate("2025-11-04"); // → "Nov 4, 2025"
timeAgo("2025-11-03T23:00:00"); // → "1 hour ago"
```

### Query

```js
buildQuery({ page: 1, sort: "asc" }); // → "page=1&sort=asc"
parseQuery("?page=1&sort=asc"); // → { page: "1", sort: "asc" }
```

### Misc

```js
uid("habit-"); // → "habit-x2hf38"
validateEmail("test@site.com"); // → true
assert(userId, "Missing userId");
```

---

## 🧭 Best Practices

✅ **Do**

* Keep functions pure & side-effect-free
* Reuse them inside hooks/components
* Comment anything non-trivial

🚫 **Don’t**

* Add API logic (`axios.js` handles that)
* Use React hooks or `window` directly without guard
* Over-complicate — short & predictable is ideal
