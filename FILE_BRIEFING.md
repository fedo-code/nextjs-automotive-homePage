# 📑 PROJECT FILE BRIEFING & DOCUMENTATION
## Complete File-by-File Overview

---

## 🎯 PROJECT STRUCTURE

```
my-project/
├── 📄 Configuration Files (Root Level)
├── 📁 app/                    (Application Code - Next.js App Router)
├── 📁 lib/                    (Shared Libraries & Utilities)
├── 📁 public/                 (Static Assets)
├── 📁 scripts/                (Utility Scripts)
└── 📁 .next/                  (Build Output - Auto Generated)
```

---

# 🔧 ROOT LEVEL CONFIGURATION FILES

## 1. **package.json**
**Location**: `package.json`  
**Purpose**: Project metadata, dependencies, and npm scripts

**What it does**:
- Defines project name (`my-project`), version, and metadata
- Lists all required npm packages (dependencies)
- Lists development-only packages (devDependencies)
- Defines npm scripts: `dev`, `build`, `start`, `lint`

**Key Dependencies**:
- `next` (16.2.9) - Full-stack React framework
- `react` (19.2.4) - UI library
- `react-dom` (19.2.4) - React rendering
- `bcryptjs` - Password hashing
- `mongodb` - Database driver
- `next-auth` - Authentication library
- `tailwindcss` - CSS framework
- `react-datepicker` - Date picker component
- `react-medium-image-zoom` - Image zoom functionality

**Available Scripts**:
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint validation
```

---

## 2. **next.config.ts**
**Location**: `next.config.ts`  
**Purpose**: Next.js configuration file

**Current State**: 
- ⚠️ EMPTY - Only contains template comment `/* config options here */`

**What it SHOULD configure** (but currently doesn't):
- Image optimization settings
- Security headers
- Redirects & rewrites
- Environment variable validation
- API route configurations

**Status**: Needs optimization additions (see PROJECT_OPTIMIZATION_REPORT.md)

---

## 3. **tsconfig.json**
**Location**: `tsconfig.json`  
**Purpose**: TypeScript compiler configuration

**What it does**:
- Sets TypeScript compilation target to ES2017
- Enables strict type checking (`strict: true`)
- Allows JavaScript files mixed with TypeScript (`allowJs: true`)
- Configures JSX transform for React 17+
- Sets module resolution to "bundler"

**Key Settings**:
- `target: "ES2017"` - Compile to ES2017 JavaScript
- `strict: true` - Enable all strict type checks
- `jsx: "react-jsx"` - Use new React JSX transform
- `allowJs: true` - Allow .js files in TS project
- Includes `app/page.jsx` explicitly (note: JSX file in TS project)

**Note**: Project uses JSX files despite TypeScript being strict - this is a mismatch that needs resolution
   
   a
   2'
   
     ---

## 4. **eslint.config.mjs**
**Location**: `eslint.config.mjs`  
**Purpose**: ESLint configuration for code quality

**What it does**:
- Configures code linting rules using Next.js recommended rules
- Specifies what files/folders to ignore during linting
- Uses eslint-config-next/core-web-vitals preset

**Ignored Folders**:
- `.next/` - Build output
- `out/` - Export output
- `build/` - Build folder
- `next-env.d.ts` - Auto-generated types file

**Purpose**: Ensures code quality and consistency across the project

---

## 5. **postcss.config.mjs**
**Location**: `postcss.config.mjs`  
**Purpose**: PostCSS configuration

**What it does**:
- Configures Tailwind CSS plugin for PostCSS
- Allows Tailwind CSS to process CSS files

**Configuration**:
```javascript
plugins: {
  "@tailwindcss/postcss": {}  // Enable Tailwind CSS
}
```

**Purpose**: Enables Tailwind CSS styling in the project

---

## 6. **next-env.d.ts**
**Location**: `next-env.d.ts`  
**Purpose**: Auto-generated TypeScript definitions for Next.js

**What it does**: 
- Provides TypeScript type definitions for Next.js
- Auto-generated during build process
- Should NOT be manually edited

**Note**: File is auto-generated, do not commit changes to version control

---

## 7. **.env.example**
*tryiication**: `.env.example`  
**Purpose**: Template for environment variables

**What it contains**:
```
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=veichle_homepage
```

**Purpose**: 
- Shows developers which environment variables are needed
- Should be checked into version control
- Developers copy this to `.env.local` for their local setup

**Usage**: Not used by app - developers must create `.env.local` from this template

---

## 8. **.env** (Not shown - exists locally)
**Location**: `.env` (or `.env.local`)  
**Purpose**: Actual environment variables (local only)

**What it should contain**:
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - Database name
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `NEXTAUTH_URL` - Auth callback URL
- `NEXTAUTH_SECRET` - JWT secret for sessions

**Security**: Should NOT be committed to git - only developers need this

---

## 9. **README.md**
**Location**: `README.md`  
**Purpose**: Project documentation and setup guide

**Current State**: 
- ⚠️ MERGE CONFLICT - Contains unresolved git markers (`<<<<<<`, `=======`, `>>>>>>>`)

**Content**:
- Merge conflict between default Next.js README and custom project README
- Should describe: project overview, setup instructions, features

**Status**: Needs conflict resolution

---

## 10. **SETUP.md**
**Location**: `SETUP.md`  
**Purpose**: Detailed setup and configuration instructions

**What it contains**:
- Prerequisites (Google OAuth, MongoDB, Node.js)
- Step-by-step Google OAuth setup guide
- Environment variable configuration
- Authorized email initialization instructions
- Starting development server
- List of features implemented
- API endpoint documentation

**Key Sections**:
1. Prerequisites
2. Google OAuth Credentials setup
3. Environment variables configuration
4. Installing dependencies
5. Initializing authorized emails
6. Starting development server
7. Features list
8. API endpoints

**Usage**: New developers should follow this guide to get project running

---

# 📁 APP FOLDER (Next.js Application Code)

## 11. **app/layout.jsx**
**Location**: `app/layout.jsx`  
**Purpose**: Root layout wrapper for entire application

**What it does**:
- Wraps entire app with `AuthProvider` (enables authentication)
- Imports Google fonts (Geist Sans and Geist Mono)
- Sets global CSS (`globals.css`)
- Defines page metadata (title: "Luxury Automotive", description)
- Sets up HTML structure with dark theme classes

**Key Components**:
- `<html>` with font variables
- `<body>` with Tailwind classes
- `<AuthProvider>` wrapper for session management
- `{children}` renders page content

**Purpose**: Every page in the app uses this layout as its outer wrapper

---

## 12. **app/page.jsx**
**Location**: `app/page.jsx`  
**Purpose**: Home page (root `/` route)

**What it does**:
- Simple wrapper component that renders `HomePage` component
- Minimal code - just imports and renders the main component

**Content**:
```jsx
import HomePage from "./components/HomePage.jsx";
export default function Home() {
  return <HomePage />;
}
```

**Route**: `/` (home page)

---

## 13. **app/globals.css**
**Location**: `app/globals.css`  
**Purpose**: Global CSS styles for entire application

**What it does**:
- Imports Tailwind CSS
- Defines CSS variables for light/dark themes
- Sets background and foreground colors
- Configures fonts and styling

**Key Styles**:
- Light theme: white background, dark text
- Dark theme: dark background, light text
- Font families: Geist Sans, Geist Mono
- Body styling

**Purpose**: Applied to entire application globally

---

## 14. **app/providers.jsx**
**Location**: `app/providers.jsx`  
**Purpose**: Authentication provider setup

**What it does**:
- Client component (`"use client"`)
- Wraps children with `SessionProvider` from Next-Auth
- Enables session management across the app

**Code**:
```jsx
"use client";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

**Purpose**: Provides authentication context to all components

---

## 15. **app/components/HomePage.jsx**
**Location**: `app/components/HomePage.jsx`  
**Purpose**: Main home page component

**What it does**:
- Client component with interactive features
- Displays statistics section
- Shows vehicle showcase with 3 featured cars
- Displays gallery of images
- Shows testimonials from customers
- Provides login/register modal
- Handles user authentication state

**Key Features**:
- **Statistics**: 340+ vehicles, 500+ clients, 20 years experience, 99% satisfaction
- **Vehicles Showcase**: Shows Aether S Coupe, Velvet X SUV, Nova GT R with details
- **Gallery**: 4 high-quality car images
- **Testimonials**: 2 customer reviews with ratings
- **Auth Modal**: Login/register form with email & password inputs
- **Password Toggle**: Show/hide password functionality
- **Session Management**: Checks user login status on page load

**Data Structure** (all hardcoded):
- `stats` array - statistics data
- `vehicles` array - featured cars
- `gallery` array - image URLs
- `testimonials` array - customer reviews

**State Management**:
- `isPopupOpen` - modal visibility
- `isAuthModalOpen` - auth modal visibility
- `authMode` - "login" or "register"
- `showPassword` - password field visibility
- `isAuthenticated` - user login status
- `authUser` - current user data
- `authError` - error messages

**Handles**:
- User registration
- User login
- Session loading
- Form input changes
- Google OAuth sign-in

**Issue**: ⚠️ ALL DATA IS HARDCODED - Should be fetched from MongoDB via API

---

## 16. **app/book-visit/page.jsx**
**Location**: `app/book-visit/page.jsx`  
**Purpose**: Book visit appointment page

**What it does**:
- Client component for booking a visit/test drive
- Provides date picker for selecting appointment date
- Collects customer information (name, email, phone)
- Lets customer select vehicle
- Collects special requirements

**Components**:
- React DatePicker integration
- Form with input fields
- Popup modal for confirmation/feedback

**Form Fields**:
- `fullName` - customer name
- `email` - customer email
- `phone` - customer phone number
- `vehicle` - vehicle selection dropdown
- `requirements` - special requests text
- `selectedDate` - appointment date picker

**State**:
- `formData` - user input
- `selectedDate` - chosen date
- `errors` - validation errors
- `isPopupOpen` - modal visibility
- `popupTitle` & `popupMessage` - modal content

**Status**: Component started but functionality needs to be verified

---

## 17. **app/book-visit/datepicker.css**
**Location**: `app/book-visit/datepicker.css`  
**Purpose**: Custom styling for date picker

**What it does**:
- Provides custom CSS for React DatePicker component
- Overrides default date picker styles
- Matches project's dark theme

**Purpose**: Makes date picker match the luxury automotive theme

---

## 18. **app/products/[id]/page.jsx**
**Location**: `app/products/[id]/page.jsx`  
**Purpose**: Dynamic product detail page

**What it does**:
- Shows detailed information for a specific vehicle
- Accepts dynamic `[id]` route parameter
- Displays vehicle specs, features, images, and description
- Requires authentication to view

**Data Structure** (hardcoded):
```javascript
vehiclesData = {
  "aether-s-coupe": { ... },
  "velvet-x-suv": { ... },
  "nova-gt-r": { ... }
}
```

**Each Vehicle Contains**:
- Basic info: id, name, category, price, description
- Full description: detailed marketing copy
- Specs: engine, horsepower, torque, top speed, acceleration, etc.
- Images: array of car photos
- Features: list of vehicle features (suspension, leather, etc.)

**Features**:
- Image gallery with multiple photos
- Detailed specifications display
- Feature highlights
- Navigation links
- Authentication check

**Route**: `/products/:id` (e.g., `/products/aether-s-coupe`)

---

# 📚 LIB FOLDER (Shared Libraries)

## 19. **lib/auth.js**
**Location**: `lib/auth.js`  
**Purpose**: Core authentication and session management logic

**What it does**:
- Password hashing & verification
- User registration & login
- Session token creation & validation
- Database connection & indexing

**Key Functions**:

1. **normalizeEmail(email)**
   - Converts email to lowercase and trims whitespace
   - Purpose: Consistent email handling

2. **hashPassword(password)**
   - Uses bcryptjs to hash passwords
   - Salt rounds: 12
   - Purpose: Secure password storage

3. **verifyPassword(password, hashedPassword)**
   - Compares plain password with hash
   - Purpose: Login validation

4. **hashSessionToken(token)**
   - SHA-256 hash of session token
   - Purpose: Secure token storage

5. **createSessionToken()**
   - Generates random 32-byte hex token
   - Purpose: Create unique session identifiers

6. **registerUser({ name, email, password })**
   - Creates new user account
   - Validates email doesn't exist
   - Hashes password, stores to MongoDB
   - Returns user object

7. **loginUser({ email, password })**
   - Finds user by email
   - Verifies password
   - Returns user object if valid
   - Returns error if invalid

8. **createSession(userId)**
   - Creates session record in MongoDB
   - Sets 7-day expiration
   - Returns session token

9. **clearSession(sessionToken)**
   - Deletes session from MongoDB
   - Used on logout

10. **getUserFromSessionToken(sessionToken)**
    - Validates session token
    - Checks expiration
    - Returns user if valid
    - Purpose: Retrieve current user

**Additional Functions** (visible in file):
- `ensureIndexes()` - Creates MongoDB indexes
- `getDb()` - Gets database connection

**Constants**:
- `SESSION_COOKIE_NAME` = "veichle_session"
- `SESSION_DURATION_MS` = 7 days

**Status**: Mostly complete but some functions may be incomplete (check file for full content)

---

## 20. **lib/mongodb.js**
**Location**: `lib/mongodb.js`  
**Purpose**: MongoDB connection pooling

**What it does**:
- Manages MongoDB client connection
- Implements connection pooling to prevent leaks
- Caches client globally
- Handles connection errors

**Key Features**:
1. **Connection Pooling**
   - Caches MongoDB client globally
   - Reuses connection across requests
   - Prevents creating multiple connections

2. **Error Handling**
   - Checks MONGODB_URI environment variable
   - Throws error if URI not set
   - Catches connection errors

3. **Global Caching**
   - Uses global variables to store client
   - Persists across multiple requests
   - Optimizes performance

**How it works**:
```
1. Check if client already cached
2. If yes, return cached client
3. If no, create promise to connect
4. Connect to MongoDB
5. Cache client globally
6. Return connected client
```

**Purpose**: Ensures efficient database connections

---

## 21. **lib/api-errors.js**
**Location**: `lib/api-errors.js`  
**Purpose**: Error handling and formatting for API responses

**What it does**:
- Parses database errors
- Returns user-friendly error messages
- Helps diagnose MongoDB connection issues

**Key Function**:

**getAuthApiError(error, fallbackMessage)**
- Handles different MongoDB error types:
  - `ENOTFOUND` - Host not found (check MONGODB_URI)
  - "authentication failed" - Invalid credentials
  - "timed out" - Network timeout or IP whitelist issue
  - Other errors - Returns fallback message

**Purpose**: Convert technical errors to helpful user messages

---

# 🔌 API ROUTES (Backend Endpoints)

## 22. **app/api/auth/login/route.js**
**Location**: `app/api/auth/login/route.js`  
**Purpose**: Email/password login endpoint

**Route**: `POST /api/auth/login`

**What it does**:
1. Receives email and password in request body
2. Validates inputs (not empty)
3. Calls `loginUser()` to verify credentials
4. Creates session token
5. Sets httpOnly cookie with token
6. Returns user data + success message

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (Success - 200):
```json
{
  "message": "Login successful.",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Response** (Failure - 401/400):
```json
{
  "error": "Invalid email or password."
}
```

**Security Features**:
- httpOnly cookie (not accessible by JavaScript)
- Secure flag (HTTPS only in production)
- SameSite: "lax" (CSRF protection)
- 7-day expiration

---

## 23. **app/api/auth/register/route.js**
**Location**: `app/api/auth/register/route.js`  
**Purpose**: User registration endpoint

**Route**: `POST /api/auth/register`

**What it does**:
1. Receives name, email, password in request body
2. Validates all fields are provided and not empty
3. Calls `registerUser()` to create account
4. Returns user data + success message
5. Does NOT set cookie (user must login)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (Success - 201):
```json
{
  "message": "Registration successful.",
  "user": {
    "id": "new_user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response** (Failure - 400):
```json
{
  "error": "Email already registered."
}
```

---

## 24. **app/api/auth/me/route.js**
**Location**: `app/api/auth/me/route.js`  
**Purpose**: Get current logged-in user endpoint

**Route**: `GET /api/auth/me`

**What it does**:
1. Reads session cookie from request
2. Calls `getUserFromSessionToken()` to validate token
3. Returns current user data if valid
4. Returns 401 error if not authenticated

**Response** (Success - 200):
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Response** (Failure - 401):
```json
{
  "error": "Unauthorized"
}
```

**Purpose**: Check if user is logged in and get their data

---

## 25. **app/api/auth/logout/route.js**
**Location**: `app/api/auth/logout/route.js`  
**Purpose**: User logout endpoint

**Route**: `POST /api/auth/logout`

**What it does**:
1. Reads session cookie from request
2. Calls `clearSession()` to delete session from database
3. Clears cookie by setting maxAge to 0
4. Returns success message

**Response** (Success - 200):
```json
{
  "message": "Logged out."
}
```

**Security Features**:
- Deletes session from database
- Clears cookie
- httpOnly cookie cleared securely

---

## 26. **app/api/auth/[...nextauth]/route.js**
**Location**: `app/api/auth/[...nextauth]/route.js`  
**Purpose**: Google OAuth authentication handler

**Route**: `GET|POST /api/auth/[...nextauth]`

**What it does**:
1. Configures Next-Auth with Google OAuth provider
2. Handles Google sign-in callback
3. Syncs Google user to MongoDB
4. Creates JWT session tokens
5. Manages session cookies

**Configuration Details**:

**Providers**:
- Google OAuth (uses GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

**Callbacks**:

1. **signIn callback**:
   - When user signs in with Google
   - Calls `syncGoogleUser()` to upsert to database
   - Returns true if successful, false if fails

2. **jwt callback**:
   - Creates JWT token with user data
   - Stores user id and email in token

3. **session callback**:
   - Builds session object from token
   - Adds user id to session

**Settings**:
- Strategy: JWT (not database sessions)
- Session duration: 7 days
- JWT max age: 7 days
- Sign-in page: "/" (home)

**Endpoints**:
- `GET /api/auth/callback/google` - Google callback URL
- `POST /api/auth/signin` - Sign in endpoint
- `GET /api/auth/session` - Get current session

**Purpose**: Enables "Sign in with Google" feature

---

## 27. **app/api/auth/authorized-emails/route.js**
**Location**: `app/api/auth/authorized-emails/route.js`  
**Purpose**: Manage authorized email whitelist

**Routes**:
- `GET /api/auth/authorized-emails` - Get all authorized emails
- `POST /api/auth/authorized-emails` - Add new authorized email

**GET Response**:
```json
{
  "emails": ["admin@veichle.com", "demo@veichle.com"]
}
```

**POST Request Body**:
```json
{
  "email": "newemail@veichle.com"
}
```

**POST Response**:
```json
{
  "message": "Email authorized successfully."
}
```

**Purpose**: Control which emails can register on the platform

---

## 28. **app/api/admin/users/route.js**
**Location**: `app/api/admin/users/route.js`  
**Purpose**: Admin endpoints for user management

**Routes**:
- `GET /api/admin/users` - Get all users (authenticated)
- `POST /api/admin/users` - Create user (admin only)

**GET Response**:
```json
{
  "emails": ["user@veichle.com", "admin@veichle.com"]
}
```

**POST Request Body**:
```json
{
  "name": "New User",
  "email": "newuser@veichle.com",
  "password": "password123"
}
```

**Security**:
- Requires `x-admin-key` header
- Compares against `ADMIN_KEY` environment variable
- Returns 401 if key doesn't match

**Purpose**: Admin interface for managing users

---

# 📝 SCRIPTS FOLDER

## 29. **scripts/init-authorized-emails.js**
**Location**: `scripts/init-authorized-emails.js`  
**Purpose**: Initialize authorized emails database

**What it does**:
1. Imports `addAuthorizedEmail()` function from auth.js
2. Defines array of authorized emails:
   - admin@veichle.com
   - demo@veichle.com
   - test@veichle.com
3. Loops through each email and adds to database
4. Logs progress to console
5. Exits process when done

**How to run**:
```bash
node scripts/init-authorized-emails.js
```

**Purpose**: Setup database with initial authorized emails for registration

**Note**: Can be run multiple times - duplicate emails will be skipped

---

# 📊 DATABASE SCHEMA

## Collections in MongoDB

### 1. **users** Collection
Stores user account information
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **sessions** Collection
Stores active session tokens
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references users),
  tokenHash: String (unique, indexed),
  createdAt: Date,
  expiresAt: Date (TTL index - auto-deletes expired)
}
```

### 3. **authorizedEmails** Collection
Whitelist of emails allowed to register
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed)
}
```

---

# 🌐 ENVIRONMENT VARIABLES NEEDED

Required in `.env.local`:

| Variable | Example | Purpose |
|----------|---------|---------|
| `MONGODB_URI` | `mongodb+srv://...` | Database connection string |
| `MONGODB_DB` | `veichle_homepage` | Database name |
| `GOOGLE_CLIENT_ID` | `123.apps...` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | `GOCSP...` | Google OAuth secret |
| `NEXTAUTH_URL` | `http://localhost:3000` | Auth callback URL |
| `NEXTAUTH_SECRET` | Random 32-char string | JWT signing secret |
| `ADMIN_KEY` | Random string | Admin endpoint secret |

---

# 📋 FILE SUMMARY TABLE

| File | Type | Purpose | Status |
|------|------|---------|--------|
| package.json | Config | Dependencies & scripts | ✅ Complete |
| next.config.ts | Config | Next.js settings | ⚠️ Empty |
| tsconfig.json | Config | TypeScript settings | ✅ Complete |
| eslint.config.mjs | Config | Linting rules | ✅ Complete |
| postcss.config.mjs | Config | CSS processing | ✅ Complete |
| .env.example | Config | Env template | ✅ Complete |
| README.md | Doc | Project overview | ⚠️ Merge conflict |
| SETUP.md | Doc | Setup guide | ✅ Complete |
| app/layout.jsx | UI | Root layout wrapper | ✅ Complete |
| app/page.jsx | UI | Home page | ✅ Complete |
| app/globals.css | Styles | Global CSS | ✅ Complete |
| app/providers.jsx | Auth | Session provider | ✅ Complete |
| app/components/HomePage.jsx | UI | Main home component | ⚠️ Hardcoded data |
| app/book-visit/page.jsx | UI | Booking page | 🔴 Incomplete |
| app/book-visit/datepicker.css | Styles | Date picker styling | ✅ Complete |
| app/products/[id]/page.jsx | UI | Product detail page | ⚠️ Hardcoded data |
| lib/auth.js | Logic | Authentication | ⚠️ May be incomplete |
| lib/mongodb.js | Logic | DB connection | ✅ Complete |
| lib/api-errors.js | Logic | Error handling | ✅ Complete |
| api/auth/login/route.js | API | Login endpoint | ✅ Complete |
| api/auth/register/route.js | API | Registration endpoint | ✅ Complete |
| api/auth/me/route.js | API | Get user endpoint | ✅ Complete |
| api/auth/logout/route.js | API | Logout endpoint | ✅ Complete |
| api/auth/[...nextauth]/route.js | API | Google OAuth handler | ✅ Complete |
| api/auth/authorized-emails/route.js | API | Email whitelist API | ⚠️ Incomplete |
| api/admin/users/route.js | API | Admin users API | ⚠️ Incomplete |
| scripts/init-authorized-emails.js | Script | Initialize emails | ✅ Complete |

---

# 🎯 KEY INSIGHTS

## What Each File Does (At a Glance)

**Configuration Files**: Set up the project environment, dependencies, and build settings

**App Files**: Build the user interface and handle client-side interactions

**Library Files**: Provide shared functionality (auth, database, errors)

**API Routes**: Handle backend logic (login, registration, user data)

**Scripts**: Perform one-time setup tasks (initialize database)

## Data Flow

```
User visits /
  ↓
app/page.jsx renders
  ↓
app/components/HomePage.jsx loads
  ↓
Fetches /api/auth/me to check if logged in
  ↓
Shows login/register form or authenticated UI
  ↓
User submits form → POST /api/auth/login or /api/auth/register
  ↓
Validates in lib/auth.js
  ↓
Stores in MongoDB
  ↓
Returns session token & sets cookie
  ↓
User state updated, UI re-renders
```

## Authentication Flow

```
Registration:
Form → /api/auth/register → registerUser() → MongoDB → Session

Login (Email/Password):
Form → /api/auth/login → loginUser() → createSession() → MongoDB → Cookie

Login (Google OAuth):
"Sign in with Google" → /api/auth/[...nextauth] → Google → syncGoogleUser() → JWT

Session Check:
GET /api/auth/me → getUserFromSessionToken() → Validate & return user
```

---

*Generated: 2026-06-20 | Complete File Documentation | No Code Changes*
