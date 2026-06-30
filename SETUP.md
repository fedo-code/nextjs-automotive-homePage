# Setup Instructions: Authorized Email & Google OAuth

## Prerequisites

1. **Google OAuth Credentials**: You need to set up a Google OAuth application to get credentials
2. **MongoDB**: Must be running locally or have a connection URI
3. **Node.js**: v18 or higher

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
6. Copy the **Client ID** and **Client Secret**

## Step 2: Update Environment Variables

Edit `.env` file and add:

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000  # Change for production
NEXTAUTH_SECRET=run_command_below_to_generate
```

### Generate NEXTAUTH_SECRET

Run this command in terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it in `.env` as `NEXTAUTH_SECRET`

## Step 3: Install Dependencies

```bash
npm install
```

This will install `next-auth` and other required packages.

## Step 4: Initialize Authorized Emails

Run the initialization script to seed the database with authorized emails:

```bash
node scripts/init-authorized-emails.js
```

This will add these authorized emails:
- `admin@veichle.com`
- `user@veichle.com`
- `demo@veichle.com`

**To add more authorized emails**, edit `scripts/init-authorized-emails.js` and update the `authorizedEmails` array, then run the script again.

Alternatively, use the API endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/authorized-emails \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@veichle.com"}'
```

## Step 5: Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features Implemented

### 1. Authorized Email Registration
- ✓ Only emails in the `authorizedEmails` collection can register
- ✓ Registration fails with clear error message for unauthorized emails
- ✓ Emails are normalized (lowercase, trimmed)

### 2. Google OAuth Integration
- ✓ "Continue with Google" button on auth modal
- ✓ Auto-syncs Google profile information
- ✓ Google emails must be authorized to sign up
- ✓ Existing users can sign in with Google

### 3. Product Detail Page
- ✓ Requires authentication before viewing details
- ✓ Redirects to home page if not authenticated
- ✓ Shows all vehicle specs, features, and image gallery

## API Endpoints

### Get Authorized Emails
```bash
GET /api/auth/authorized-emails
```

### Add Authorized Email
```bash
POST /api/auth/authorized-emails
Content-Type: application/json

{
  "email": "newuser@example.com"
}
```

### Register (Email/Password)
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@veichle.com",
  "password": "SecurePassword123"
}
```

### Google OAuth Sign-In
Automatically handled by clicking "Continue with Google" button

### Check Session
```bash
GET /api/auth/me
```

### Logout
```bash
POST /api/auth/logout
```

## Testing

### Test Authorized Email Registration
1. Go to home page
2. Click "Register"
3. Try registering with `test@veichle.com` (should succeed)
4. Try registering with `unauthorized@example.com` (should fail with error)

### Test Google OAuth
1. Click "Continue with Google"
2. Complete Google login with authorized email
3. Should be redirected to home page and logged in
4. Try with unauthorized Google account (should fail)

### Test View Details
1. Without being logged in, click "View Details" on any vehicle
2. Should redirect to home page to login
3. After logging in, click "View Details" again
4. Should navigate to product detail page

## Troubleshooting

### Issue: "Email not authorized to register"
- Solution: Add your email to the authorized emails list using the API endpoint or initialization script

### Issue: Google OAuth not working
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correctly set in `.env`
- Verify redirect URI matches in Google Console
- Check `NEXTAUTH_URL` matches your current domain

### Issue: MongoDB connection failed
- Ensure MongoDB is running (`mongod`)
- Check `MONGODB_URI` in `.env` is correct
- Default: `mongodb://127.0.0.1:27017`

### Issue: Can't see "Continue with Google" button
- Ensure `next-auth` is installed: `npm install`
- Restart dev server: `npm run dev`
- Check browser console for errors

## Production Deployment

1. Set `NEXTAUTH_URL` to your production domain
2. Generate a new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
3. Update Google OAuth callback URI in Google Console
4. Use production MongoDB URI in `MONGODB_URI`
5. Set `NODE_ENV=production`
6. Run: `npm run build && npm run start`

## Database Collections

### users
```json
{
  "_id": ObjectId,
  "name": "User Name",
  "email": "user@example.com",
  "passwordHash": "bcrypt_hash",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### sessions
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "tokenHash": "sha256_hash",
  "createdAt": ISODate,
  "expiresAt": ISODate
}
```

### authorizedEmails
```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "createdAt": ISODate,
  "addedBy": "admin"
}
```

### accounts (NextAuth)
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "type": "oauth",
  "provider": "google",
  "providerAccountId": "google_id",
  "refresh_token": "...",
  "access_token": "...",
  "expires_at": number,
  "token_type": "Bearer",
  "scope": "..."
}
```

### sessions (NextAuth)
```json
{
  "_id": ObjectId,
  "sessionToken": "...",
  "userId": ObjectId,
  "expires": ISODate
}
```
