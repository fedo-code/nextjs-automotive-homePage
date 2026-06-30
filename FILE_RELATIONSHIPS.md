# 🗺️ PROJECT FILE RELATIONSHIPS & DATA FLOW DIAGRAMS

---

## 📊 FILE DEPENDENCY TREE

```
package.json (Dependencies)
    ↓
    ├─→ next.config.ts (Next.js config)
    ├─→ tsconfig.json (TypeScript config)
    ├─→ eslint.config.mjs (Linting config)
    ├─→ postcss.config.mjs (CSS config)
    │
    └─→ app/
        ├─→ layout.jsx
        │   ├─→ providers.jsx
        │   │   ├─→ react (SessionProvider)
        │   │   └─→ next-auth/react
        │   │
        │   └─→ globals.css
        │       └─→ tailwindcss
        │
        ├─→ page.jsx
        │   └─→ components/HomePage.jsx
        │       ├─→ next/link
        │       ├─→ next-auth/react
        │       └─→ [hardcoded data]
        │
        ├─→ book-visit/
        │   ├─→ page.jsx
        │   │   └─→ react-datepicker
        │   └─→ datepicker.css
        │
        ├─→ products/
        │   └─→ [id]/page.jsx
        │       ├─→ next/navigation
        │       └─→ [hardcoded vehicle data]
        │
        └─→ api/
            └─→ auth/
                ├─→ login/route.js
                │   ├─→ lib/auth.js
                │   │   ├─→ bcryptjs (password hashing)
                │   │   ├─→ crypto (tokens)
                │   │   ├─→ mongodb (database)
                │   │   └─→ lib/mongodb.js
                │   │       └─→ .env (MONGODB_URI)
                │   └─→ lib/api-errors.js
                │
                ├─→ register/route.js
                │   └─→ [same as login]
                │
                ├─→ me/route.js
                │   └─→ [validates session token]
                │
                ├─→ logout/route.js
                │   └─→ [clears session]
                │
                ├─→ [...]nextauth/route.js
                │   ├─→ next-auth
                │   ├─→ GoogleProvider
                │   ├─→ lib/auth.js (syncGoogleUser)
                │   └─→ .env (GOOGLE_* secrets)
                │
                ├─→ authorized-emails/route.js
                │   └─→ lib/auth.js
                │
                └─→ admin/
                    └─→ users/route.js
                        ├─→ lib/auth.js
                        └─→ .env (ADMIN_KEY)

lib/
    ├─→ auth.js
    │   ├─→ bcryptjs
    │   ├─→ crypto
    │   ├─→ mongodb
    │   ├─→ mongodb.js
    │   └─→ .env (MONGODB_DB)
    │
    ├─→ mongodb.js
    │   └─→ .env (MONGODB_URI)
    │
    └─→ api-errors.js

scripts/
    └─→ init-authorized-emails.js
        ├─→ lib/auth.js
        └─→ .env (MONGODB_URI)
```

---

## 🔄 USER REGISTRATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. USER INTERFACE
   └─→ app/components/HomePage.jsx
       ├─ User clicks "Register"
       ├─ Opens auth modal
       ├─ Enters name, email, password
       └─ Clicks "Sign Up"

2. FORM SUBMISSION
   └─→ POST /api/auth/register
       ├─ Request body: { name, email, password }
       └─ Route: app/api/auth/register/route.js

3. VALIDATION
   └─→ Checks:
       ├─ Name not empty ✓
       ├─ Email not empty ✓
       └─ Password not empty ✓

4. PROCESS REGISTRATION
   └─→ lib/auth.js::registerUser()
       ├─ normalizeEmail() → lowercase & trim
       ├─ Check if user exists in MongoDB users collection
       ├─ hashPassword() → bcryptjs (salt: 12)
       └─ Insert new user record

5. STORE IN DATABASE
   └─→ MongoDB users collection
       {
         _id: ObjectId,
         name: "John Doe",
         email: "john@example.com",
         passwordHash: "$2a$12$...",
         createdAt: 2026-06-20,
         updatedAt: 2026-06-20
       }

6. RESPONSE TO CLIENT
   └─→ 201 Created
       {
         "message": "Registration successful.",
         "user": {
           "id": "ObjectId_string",
           "name": "John Doe",
           "email": "john@example.com"
         }
       }

7. USER ACTION
   └─→ User must now click "Login"
       └─ Triggers login flow (see below)
```

---

## 🔐 USER LOGIN FLOW (Email/Password)

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. USER INTERFACE
   └─→ app/components/HomePage.jsx
       ├─ User enters email & password
       ├─ Clicks "Login"
       └─ Form submitted

2. SEND REQUEST
   └─→ POST /api/auth/login
       ├─ Route: app/api/auth/login/route.js
       └─ Request body: { email, password }

3. VALIDATE INPUT
   └─→ Checks:
       ├─ Email provided ✓
       └─ Password provided ✓

4. VERIFY CREDENTIALS
   └─→ lib/auth.js::loginUser()
       ├─ normalizeEmail() → convert to lowercase
       ├─ Query MongoDB users collection
       ├─ Find user by email
       ├─ verifyPassword() → bcryptjs.compare()
       └─ Return user or error

5. CREATE SESSION
   └─→ lib/auth.js::createSession()
       ├─ createSessionToken() → crypto.randomBytes(32)
       ├─ hashSessionToken() → SHA-256 hash
       ├─ Insert into MongoDB sessions collection
       │  {
       │    userId: ObjectId,
       │    tokenHash: "sha256_hash_string",
       │    createdAt: Date,
       │    expiresAt: Date (7 days from now)
       │  }
       └─ Return sessionToken (unhashed) + expiresAt

6. SET COOKIE
   └─→ Response.cookies.set()
       ├─ name: "veichle_session"
       ├─ value: sessionToken (unhashed)
       ├─ httpOnly: true (JavaScript can't access)
       ├─ sameSite: "lax" (CSRF protection)
       ├─ secure: true (HTTPS only in production)
       ├─ path: "/"
       └─ expires: 7 days

7. RESPONSE TO CLIENT
   └─→ 200 OK
       {
         "message": "Login successful.",
         "user": {
           "id": "user_id",
           "name": "John Doe",
           "email": "john@example.com"
         }
       }
       + Cookie header set

8. BROWSER STORES COOKIE
   └─→ Browser automatically saves cookie
       └─ Sent with every future request

9. FRONTEND STATE UPDATE
   └─→ app/components/HomePage.jsx
       ├─ Update isAuthenticated = true
       ├─ Store authUser data
       └─ Re-render UI
```

---

## 🔄 SESSION VALIDATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                 SESSION VALIDATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. PAGE LOAD/REFRESH
   └─→ app/components/HomePage.jsx useEffect()
       └─ Calls fetch('/api/auth/me')

2. AUTOMATIC COOKIE INCLUSION
   └─→ Browser automatically adds cookie to request
       ├─ Header: { credentials: 'include' }
       └─ Cookie: veichle_session=<token>

3. GET CURRENT USER
   └─→ GET /api/auth/me
       ├─ Route: app/api/auth/me/route.js
       ├─ Extract cookie from request.cookies
       └─ Get SESSION_COOKIE_NAME value

4. VALIDATE TOKEN
   └─→ lib/auth.js::getUserFromSessionToken()
       ├─ Hash the token → SHA-256
       ├─ Query MongoDB sessions collection
       ├─ Find session where:
       │  ├─ tokenHash matches hashed token
       │  └─ expiresAt > now (not expired)
       └─ If found, get userId

5. RETRIEVE USER DATA
   └─→ Query MongoDB users collection
       ├─ Find user by _id = userId
       └─ Return user document

6. RESPONSE TO CLIENT
   └─→ 200 OK (if valid)
       {
         "user": {
           "id": "user_id",
           "name": "John Doe",
           "email": "john@example.com"
         }
       }
       
   OR
   
   └─→ 401 Unauthorized (if invalid/expired)
       {
         "error": "Unauthorized"
       }

7. FRONTEND STATE
   └─→ App updates based on response:
       ├─ If valid: Show authenticated UI
       └─ If invalid: Show login form
```

---

## 🚪 LOGOUT FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOGOUT FLOW                                  │
└─────────────────────────────────────────────────────────────────┘

1. USER CLICKS LOGOUT
   └─→ app/components/HomePage.jsx
       └─ Calls logout endpoint

2. SEND LOGOUT REQUEST
   └─→ POST /api/auth/logout
       ├─ Route: app/api/auth/logout/route.js
       └─ Cookie sent automatically

3. DELETE SESSION
   └─→ lib/auth.js::clearSession()
       ├─ Hash the session token
       ├─ Query MongoDB sessions collection
       └─ Delete session document matching tokenHash

4. CLEAR COOKIE
   └─→ Response.cookies.set()
       ├─ name: "veichle_session"
       ├─ value: "" (empty)
       ├─ maxAge: 0 (immediately expired)
       └─ Tells browser to delete cookie

5. RESPONSE TO CLIENT
   └─→ 200 OK
       {
         "message": "Logged out."
       }

6. BROWSER DELETES COOKIE
   └─→ Cookie removed from browser storage
       └─ No longer sent with requests

7. FRONTEND CLEANUP
   └─→ App updates:
       ├─ isAuthenticated = false
       ├─ authUser = null
       └─ Show login form
```

---

## 🔵 GOOGLE OAUTH FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                  GOOGLE OAUTH FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. USER CLICKS "Sign in with Google"
   └─→ app/components/HomePage.jsx
       └─ Triggers signIn('google') from next-auth

2. REDIRECT TO GOOGLE
   └─→ Browser redirects to Google OAuth consent screen
       ├─ URL: accounts.google.com/...
       ├─ Includes GOOGLE_CLIENT_ID
       └─ Includes redirect_uri: /api/auth/callback/google

3. USER AUTHORIZES
   └─→ User approves app access to their Google account
       └─ Google redirects back with authorization code

4. NEXT-AUTH HANDLES CALLBACK
   └─→ /api/auth/callback/google
       ├─ Route: app/api/auth/[...nextauth]/route.js
       ├─ Next-Auth exchanges code for access token
       └─ Gets user profile (email, name, image)

5. SYNC TO MONGODB
   └─→ Callback: signIn() function triggers
       ├─ Calls lib/auth.js::syncGoogleUser()
       │  ├─ Normalizes email
       │  ├─ Queries MongoDB for existing user
       │  ├─ If exists: Update profile
       │  ├─ If not: Create new user
       │  └─ Store to users collection
       └─ Returns true (allow signin)

6. CREATE JWT TOKEN
   └─→ Callback: jwt() function triggers
       ├─ Creates JWT token containing:
       │  ├─ user id
       │  ├─ user email
       │  └─ Other claims
       └─ Token valid for 7 days

7. CREATE SESSION
   └─→ Callback: session() function triggers
       ├─ Builds session object from JWT token
       ├─ Adds user information
       └─ Returns session

8. REDIRECT TO APP
   └─→ Browser redirected to home page (/)
       ├─ Session cookie set
       └─ JWT stored in token

9. AUTHENTICATED
   └─→ User now signed in
       ├─ Session valid for 7 days
       └─ Can access protected routes
```

---

## 📊 DATABASE SCHEMA RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                              │
└─────────────────────────────────────────────────────────────────┘

USERS Collection
├─ _id: ObjectId (Primary Key)
├─ name: String
├─ email: String (UNIQUE INDEX)
├─ passwordHash: String (bcryptjs hash)
├─ createdAt: Date
└─ updatedAt: Date

         ↑↓ (references userId)

SESSIONS Collection
├─ _id: ObjectId (Primary Key)
├─ userId: ObjectId (Foreign Key → users._id)
├─ tokenHash: String (UNIQUE INDEX, SHA-256 hash)
├─ createdAt: Date
└─ expiresAt: Date (TTL INDEX - auto-deletes)

AUTHORIZED_EMAILS Collection
├─ _id: ObjectId (Primary Key)
├─ email: String (UNIQUE INDEX)
└─ (no other fields)

PRODUCTS Collection (NOT USED YET - Hardcoded)
├─ _id: ObjectId
├─ name: String
├─ category: String
├─ price: String
├─ description: String
├─ fullDescription: String
├─ images: Array[String]
├─ specs: Object
└─ features: Array[String]
```

---

## 🔌 API ENDPOINTS MAP

```
┌─────────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                                │
└─────────────────────────────────────────────────────────────────┘

AUTHENTICATION ENDPOINTS
├─ POST   /api/auth/login
│         Register session, set cookie
│
├─ POST   /api/auth/register
│         Create new user account
│
├─ GET    /api/auth/me
│         Get current authenticated user
│
├─ POST   /api/auth/logout
│         Clear session and cookie
│
├─ GET/POST /api/auth/[...nextauth]
│           Google OAuth handler
│
├─ GET/POST /api/auth/authorized-emails
│           Manage email whitelist
│
└─ GET/POST /api/auth/callback/google
            Google OAuth callback (auto)

ADMIN ENDPOINTS (Protected)
└─ GET/POST /api/admin/users
            Manage users (requires ADMIN_KEY header)

PRODUCT ENDPOINTS (Proposed - Not yet implemented)
├─ GET    /api/products
├─ GET    /api/products/:id
├─ POST   /api/admin/products
└─ PUT    /api/admin/products/:id
```

---

## 🎨 COMPONENT HIERARCHY

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT TREE                               │
└─────────────────────────────────────────────────────────────────┘

<RootLayout>
  ├─ Imports fonts (Geist)
  ├─ Sets metadata
  └─ <AuthProvider>
      └─ <SessionProvider>
          │
          ├─ <Home> (page.jsx)
          │  └─ <HomePage>
          │     ├─ Statistics section
          │     ├─ Vehicle showcase
          │     ├─ Gallery
          │     ├─ Testimonials
          │     └─ Auth modal
          │        ├─ Login form
          │        └─ Register form
          │
          ├─ <BookVisit> (book-visit/page.jsx)
          │  ├─ DatePicker
          │  ├─ Form fields
          │  └─ Popup modal
          │
          └─ <ProductDetail> (products/[id]/page.jsx)
             ├─ Product info
             ├─ Specs section
             ├─ Features list
             └─ Image gallery
```

---

## 📤 DATA FLOW SUMMARY

```
User Interaction
       ↓
Component State Updates
       ↓
Form Submit / Button Click
       ↓
Fetch API Endpoint (POST/GET)
       ↓
Route Handler (app/api/*/route.js)
       ↓
Validate Input
       ↓
Call Library Function (lib/*.js)
       ↓
Database Operation (MongoDB)
       ↓
Format Response
       ↓
Return Response (JSON)
       ↓
Browser Receives Response
       ↓
Component Updates State
       ↓
UI Re-renders
       ↓
User Sees Changes
```

---

## ⚙️ REQUEST/RESPONSE CYCLE

```
CLIENT SIDE                              SERVER SIDE
──────────────                           ──────────

User Action
   ↓
Form Validation
   ↓
fetch('/api/...')  ────────────────────→  Route Handler
                                          ├─ Validate
                                          ├─ Process
                                          ├─ Query DB
                                          └─ Format response
                   ←────────────────────  Response (JSON)
   ↓
Parse JSON
   ↓
Update Component State
   ↓
Re-render UI
   ↓
User Sees Update
```

---

## 🔒 SECURITY LAYERS

```
INPUT VALIDATION
├─ Client-side (basic checks)
└─ Server-side (strict validation) ← IMPORTANT

AUTHENTICATION
├─ Session token (custom implementation)
└─ JWT token (Next-Auth Google OAuth)

PASSWORD SECURITY
├─ Bcryptjs hashing (12 salt rounds)
├─ Never stored in plain text
└─ Compared at login

TOKEN SECURITY
├─ Random 32-byte tokens
├─ SHA-256 hash stored in DB
├─ httpOnly cookies (JavaScript can't access)
└─ 7-day expiration (TTL index)

COOKIE SECURITY
├─ httpOnly flag (XSS protection)
├─ sameSite: "lax" (CSRF protection)
├─ secure flag (HTTPS only in production)
└─ Domain-specific

DATABASE
├─ Connection pooling
├─ Indexes on unique fields
├─ TTL indexes for auto-cleanup
└─ Normalized email addresses
```

---

*Generated: 2026-06-20 | Visual Reference Guide*
