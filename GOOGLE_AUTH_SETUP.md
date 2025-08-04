# Google Authentication Setup

This guide will help you set up Google authentication for your GTA Auto application.

## Prerequisites

1. Google Cloud Console account
2. NextAuth.js installed (already done)
3. Backend API endpoint for Google authentication

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: GTA Auto
   - User support email: your-email@domain.com
   - Developer contact information: your-email@domain.com
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: GTA Auto Web Client
   - Authorized JavaScript origins: `http://localhost:3032`
   - Authorized redirect URIs: `http://localhost:3032/api/auth/callback/google`

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3032
NEXTAUTH_SECRET=your_nextauth_secret_here

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Backend API Setup

Ensure your backend has the following endpoint:

```http
POST /api/user/google-auth
Content-Type: application/json

{
  "token": "google_id_token_here"
}
```

Response:
```json
{
  "success": true,
  "message": "Google authentication successful",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "",
    "avatar": "https://lh3.googleusercontent.com/...",
    "isVerified": true,
    "role": "user",
    "registeredWith": "google",
    "favourite": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### 4. Features Added

- ✅ Google Sign-in button on login page
- ✅ Integration with existing auth system
- ✅ Automatic redirect after successful authentication
- ✅ Error handling for failed authentication
- ✅ Loading states during authentication
- ✅ Session management with NextAuth

### 5. Usage

1. Users can click "Continue with Google" button on the login page
2. They will be redirected to Google's OAuth consent screen
3. After successful authentication, they'll be redirected back to your app
4. The user will be automatically logged in and redirected to the dashboard

### 6. Security Notes

- Keep your Google OAuth credentials secure
- Use environment variables for sensitive data
- Implement proper error handling
- Consider adding rate limiting for authentication attempts
- Validate tokens on the backend

### 7. Troubleshooting

1. **"Invalid redirect URI" error**: Make sure the redirect URI in Google Cloud Console matches exactly
2. **"Client ID not found" error**: Check that your environment variables are set correctly
3. **"Network error"**: Ensure your backend API is running and accessible
4. **"Authentication failed"**: Check the browser console and backend logs for detailed error messages

### 8. Production Deployment

For production deployment:

1. Update the authorized origins and redirect URIs in Google Cloud Console
2. Set the correct `NEXTAUTH_URL` for your production domain
3. Generate a secure `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32`)
4. Update the `NEXT_PUBLIC_API_URL` to your production API URL
5. Ensure your backend API is deployed and accessible

## Files Modified

- `src/app/api/auth/[...nextauth]/route.js` - NextAuth configuration
- `src/app/layout.js` - Added SessionProvider
- `src/sections/auth/jwt/jwt-login-view.js` - Added Google sign-in button
- `src/hooks/use-nextauth.js` - Custom hook for NextAuth integration
- `env.example` - Environment variables template 