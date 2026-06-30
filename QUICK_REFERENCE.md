# 📋 QUICK FILE REFERE-|---------|
| **package.json** | Lists all npm dependencies and defines npm commands |
| **next.config.ts** | Next.js configuration (currently empty - needs optimization) |
| **tsconfig.json** | TypeScript compiler settings |
| **eslint.config.mjs** | Code quality and linting rules |
| **postcss.config.mjs** | Enables Tailwind CSS processing |
| **next-env.d.ts** | Auto-generated TypeScript definitions (don't edit) |
| **.env.example** | Template showing which environment variables are needed |
| **.env** | Actual environment variables (local only, not in git) |
| **README.md** | Project documentation (⚠️ has merge conflict) |
| **SETUP.md** | Step-by-step setup instructions |
| **app/layout.jsx** | Root page layout wrapper for entire app |
| **app/page.jsx** | Home page (/) - renders HomePage component |
| **app/globals.css** | Global CSS styles applied to entire app |
| **app/providers.jsx** | Authentication provider setup |
| **app/components/HomePage.jsx** | Main homepage UI with features and login modal |
| **app/book-visit/page.jsx** | Appointment booking page with date picker |
| **app/book-visit/datepicker.css** | Custom styling for date picker |
| **app/products/[id]/page.jsx** | Individual product detail page (dynamic route) |
| **lib/auth.js** | Core authentication logic (password, sessions, tokens) |
| **lib/mongodb.js** | MongoDB connection pooling and caching |
| **lib/api-errors.js** | Error message formatting for API responses |
| **api/auth/login/route.js** | Handles POST /api/auth/login (email/password login) |
| **api/auth/register/route.js** | Handles POST /api/auth/register (create account) |
| **api/auth/me/route.js** | Handles GET /api/auth/me (get current user) |
| **api/auth/logout/route.js** | Handles POST /api/auth/logout (destroy session) |
| **api/auth/[...nextauth]/route.js** | Handles Google OAuth and JWT authentication |
| **api/auth/authorized-emails/route.js** | Manages email whitelist for registration |
| **api/admin/users/route.js** | Admin endpoints for user management |
| **scripts/init-authorized-emails.js** | Initialize database with authorized emails |

---

## 🗂️ FILES BY CATEGORY

### Configuration Files (Environment Setup)
```
package.json           ← Dependency management
next.config.ts         ← Next.js settings
tsconfig.json          ← TypeScript rules
eslint.config.mjs      ← Code linting
postcss.config.mjs     ← CSS processing
.env.example           ← Environment template
.env                   ← Actual secrets (local only)
```

### Documentation Files
```
README.md              ← Project overview
SETUP.md               ← Setup instructions
```

### UI/Components (Frontend)
```
app/layout.jsx         ← Root wrapper
app/page.jsx           ← Home page
app/globals.css        ← Global styles
app/providers.jsx      ← Auth provider
app/components/HomePage.jsx     ← Main UI
app/book-visit/page.jsx         ← Booking form
app/book-visit/datepicker.css   ← Picker styling
app/products/[id]/page.jsx      ← Product detail
```

### Authentication & Logic (Backend)
```
lib/auth.js            ← Auth logic
lib/mongodb.js         ← DB connection
lib/api-errors.js      ← Error handling
```

### API Routes (Endpoints)
```
api/auth/login/
api/auth/register/
api/auth/me/
api/auth/logout/
api/auth/[...nextauth]/
api/auth/authorized-emails/
api/admin/users/
```

### Utility Scripts
```
scripts/init-authorized-emails.js   ← Setup script
```

---

## 🚀 WHAT GETS EXECUTED WHEN

### On `npm run dev` (Development)
1. **next.config.ts** - Loaded for Next.js settings
2. **tsconfig.json** - TypeScript compilation configured
3. **package.json** - Dependencies loaded
4. **app/layout.jsx** - Root layout initialized
5. **app/globals.css** - Styles imported
6. Dev server starts on localhost:3000

### When User Visits `/`
1. **app/page.jsx** - Renders
2. **app/components/HomePage.jsx** - Loads component
3. **app/globals.css** - Styles applied
4. **app/providers.jsx** - Auth context provided
5. Component calls `fetch('/api/auth/me')` ← Backend call

### On User Registration
```
User fills form in HomePage.jsx
   ↓
Submits to POST /api/auth/register
   ↓
route.js validates input
   ↓
Calls lib/auth.js registerUser()
   ↓
Connects via lib/mongodb.js
   ↓
Writes to MongoDB
   ↓
Returns response to client
```

### On User Login
```
User fills form in HomePage.jsx
   ↓
Submits to POST /api/auth/login
   ↓
route.js validates input
   ↓
Calls lib/auth.js loginUser()
   ↓
Verifies password with bcryptjs
   ↓
Creates session token
   ↓
Stores token hash in MongoDB
   ↓
Sets httpOnly cookie
   ↓
Returns user data
```

### On Every Page Load
```
HomePage.jsx mounts
   ↓
useEffect() runs
   ↓
Calls GET /api/auth/me
   ↓
route.js reads cookie
   ↓
Validates token via lib/auth.js
   ↓
Returns user or null
   ↓
UI updates based on response
```

---

## 📊 WHAT EACH FILE READS & WRITES

### Reads From

**package.json**:
- Dependency versions (npm)

**tsconfig.json**:
- TypeScript compiler
- ESLint

**next.config.ts**:
- Next.js framework

**app/layout.jsx**:
- app/page.jsx (renders within)
- globals.css (imports)
- providers.jsx (imports)

**app/page.jsx**:
- app/components/HomePage.jsx

**lib/auth.js**:
- bcryptjs package
- crypto package
- lib/mongodb.js
- Environment variables (MONGODB_DB)

**lib/mongodb.js**:
- mongodb package
- Environment variables (MONGODB_URI)

**API routes (all)**:
- lib/auth.js
- lib/api-errors.js
- Environment variables

### Writes To

**lib/auth.js**:
- MongoDB users collection (register/login)
- MongoDB sessions collection (create/clear session)
- MongoDB authorizedEmails collection

**lib/mongodb.js**:
- Creates global MongoDB connection

**API routes (all)**:
- HTTP responses to client
- Cookies (set in response headers)

**scripts/init-authorized-emails.js**:
- MongoDB authorizedEmails collection

---

## 🔄 WHICH FILES COMMUNICATE WITH EACH OTHER

```
CLIENT → SERVER Communication
────────────────────────────
HomePage.jsx        ──POST──>  /api/auth/login
   ↓                           /api/auth/register
   └─(fetch calls)             /api/auth/me
                               /api/auth/logout

API Routes           ──CALL──>  lib/auth.js
   ├─ login                    lib/mongodb.js
   ├─ register                 lib/api-errors.js
   ├─ me
   ├─ logout
   ├─ [...nextauth]
   ├─ authorized-emails
   └─ admin/users

lib/auth.js         ──READ/WRITE──>  MongoDB
                                     ├─ users
                                     ├─ sessions
                                     └─ authorizedEmails

lib/mongodb.js      ──CONNECT──>  MongoDB URI
                                  (from .env)

All API routes      ──IMPORTS──>   .env
                                   MONGODB_URI
                                   NEXTAUTH_SECRET
                                   GOOGLE_CLIENT_*
```

---

## ⚡ IMPORTANT FILE STATES

### ✅ COMPLETE & WORKING
- package.json
- tsconfig.json
- eslint.config.mjs
- postcss.config.mjs
- app/layout.jsx
- app/page.jsx
- app/globals.css
- app/providers.jsx
- lib/mongodb.js
- lib/api-errors.js
- api/auth/login/route.js
- api/auth/register/route.js
- api/auth/me/route.js
- api/auth/logout/route.js
- api/auth/[...nextauth]/route.js
- scripts/init-authorized-emails.js
- SETUP.md

### ⚠️ NEEDS ATTENTION
- next.config.ts (empty, needs optimization)
- README.md (merge conflict)
- app/components/HomePage.jsx (data hardcoded)
- app/products/[id]/page.jsx (data hardcoded)
- lib/auth.js (may have incomplete functions)
- api/auth/authorized-emails/route.js (incomplete)
- api/admin/users/route.js (incomplete)

### 🔴 MISSING/NOT STARTED
- next-env.d.ts (auto-generated)
- No product management API
- No image optimization config

---

## 🎯 WHO USES WHAT

### Frontend Components
- Read: **app/globals.css**, **app/providers.jsx**
- Use: Next.js, React, Tailwind CSS
- Call: API routes
- Communicate: Each other via state

### Backend API Routes
- Read: **lib/auth.js**, **lib/api-errors.js**
- Read: **.env** variables
- Write: MongoDB collections
- Return: JSON responses

### Authentication Library
- Read: **bcryptjs**, **crypto**, **mongodb**
- Read: **.env** for MONGODB_DB
- Write: MongoDB collections
- Used by: All API routes

### Database Connection
- Read: **.env** for MONGODB_URI
- Connect: MongoDB cluster
- Reuse: Connection pooling
- Used by: lib/auth.js

### Scripts
- Read: **lib/auth.js**, **.env**
- Write: MongoDB collections
- Run: Once during setup

---

## 📝 CRITICAL FILE DEPENDENCIES

```
If you change:              It affects:
────────────────            ────────────
package.json             →  npm install, all imports
tsconfig.json            →  TypeScript compilation
next.config.ts           →  Build output, performance
.env variables           →  Database, auth, secrets
lib/auth.js              →  All API routes
lib/mongodb.js           →  Database connection
app/layout.jsx           →  All pages
app/providers.jsx        →  Authentication for all pages
app/globals.css          →  Styling everywhere
```

---

## 🔍 HOW TO FIND SPECIFIC FUNCTIONALITY

### Need to understand authentication?
→ Read: **lib/auth.js**, **api/auth/login/route.js**, **api/auth/register/route.js**

### Need to understand sessions?
→ Read: **lib/auth.js**, **api/auth/me/route.js**, **api/auth/logout/route.js**

### Need to understand Google OAuth?
→ Read: **api/auth/[...nextauth]/route.js**, **SETUP.md**

### Need to understand database?
→ Read: **lib/mongodb.js**, **lib/auth.js**

### Need to understand UI?
→ Read: **app/components/HomePage.jsx**, **app/book-visit/page.jsx**

### Need to understand product pages?
→ Read: **app/products/[id]/page.jsx**

### Need to understand styling?
→ Read: **app/globals.css**, **app/book-visit/datepicker.css**, **tailwindcss**

### Need to understand configuration?
→ Read: **package.json**, **tsconfig.json**, **next.config.ts**

### Need setup instructions?
→ Read: **SETUP.md**, **.env.example**

---

## 🗺️ NAVIGATION BY USE CASE

### "I want to add a new feature"
1. Determine if frontend or backend
2. **Frontend**: Create component, import in page
3. **Backend**: Create API route, call from component
4. Check **lib/auth.js** for shared functions
5. Update **next.config.ts** if needed

### "I want to fix a bug"
1. Find which file contains the bug (use **FILE_BRIEFING.md**)
2. Check related files for context
3. Look at **FILE_RELATIONSHIPS.md** for dependencies
4. Make changes only to identified file(s)
5. Test the affected flow

### "I want to optimize the app"
1. Start with **PROJECT_OPTIMIZATION_REPORT.md**
2. Update **next.config.ts** with optimization settings
3. Convert JSX files to TSX
4. Add caching and pagination
5. See **FILE_BRIEFING.md** for specific files

### "I want to deploy"
1. Ensure all **.env** variables are set
2. Run **npm run build** to generate build output
3. Check **next.config.ts** for production settings
4. Verify **SETUP.md** for requirements
5. Deploy with `npm run start`

---

## 📚 FILE SIZE & COMPLEXITY

| File | Size | Complexity | Read Time |
|------|------|-----------|-----------|
| package.json | Small | Low | 1 min |
| tsconfig.json | Small | Low | 1 min |
| next.config.ts | Tiny | None | 30 sec |
| lib/auth.js | Large | High | 5 min |
| HomePage.jsx | Large | Medium | 5 min |
| api/auth/*/route.js | Small | Medium | 2 min each |
| SETUP.md | Medium | Low | 5 min |
| PROJECT_OPTIMIZATION_REPORT.md | Very Large | Medium | 20 min |

---

## ✅ FILE CHECKLIST FOR NEW DEVELOPERS

- [ ] Read **README.md** (after resolving merge conflict)
- [ ] Follow **SETUP.md** to setup local environment
- [ ] Read **FILE_BRIEFING.md** to understand each file
- [ ] Review **FILE_RELATIONSHIPS.md** to see connections
- [ ] Check **.env.example** and create **.env.local**
- [ ] Run `npm install` to install dependencies
- [ ] Run `node scripts/init-authorized-emails.js` to init DB
- [ ] Run `npm run dev` to start development server
- [ ] Test login flow locally
- [ ] Review **PROJECT_OPTIMIZATION_REPORT.md** for improvements
- [ ] Make first code changes!

---

*Quick Reference Generated: 2026-06-20 | Use with FILE_BRIEFING.md*
