# Authentication Setup Guide

This guide will help you configure Google OAuth and Twilio SMS authentication for the PartyFarm Dashboard.

## Prerequisites

- A Google Cloud Platform account
- A Twilio account
- Access to your Supabase project dashboard

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

### 2. Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "PartyFarm Dashboard"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed (for development)

### 3. Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - For local development: `http://127.0.0.1:54321/auth/v1/callback`
   - For production: `https://your-project.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret

### 4. Update Environment Variables

Add to your `.env.local` file:
```bash
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret_here
```

## Twilio SMS Setup

### 1. Create Twilio Account

1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a new account or log in
3. Complete phone number verification

### 2. Get Account Credentials

1. From the Twilio Console Dashboard, copy:
   - Account SID
   - Auth Token

### 3. Create Messaging Service

1. Navigate to "Messaging" > "Services"
2. Click "Create Messaging Service"
3. Choose "Notify my users" use case
4. Add a sender (phone number or Sender ID)
5. Copy the Messaging Service SID

### 4. Update Environment Variables

Add to your `.env.local` file:
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_MESSAGE_SERVICE_SID=your_twilio_message_service_sid_here
```

## Supabase Configuration

The authentication providers are already configured in `supabase/config.toml`. The configuration includes:

### Google OAuth
- Enabled with environment variable references
- Skip nonce check enabled for local development
- Redirect URIs configured for local and production

### SMS Authentication
- Enabled with Twilio provider
- Custom OTP template
- 60-second rate limiting between SMS sends
- 10-minute OTP expiry

### Site URLs
- Local development: `http://localhost:5173`
- Additional redirect URLs for various local ports

## Testing the Setup

### 1. Start Supabase

```bash
cd partyfarm-dashboard
supabase start
```

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Test Google OAuth

1. Navigate to your login page
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. Verify you're redirected back to the application

### 4. Test Phone Authentication

1. Navigate to your login page
2. Enter a valid phone number (with country code)
3. Click "Send OTP"
4. Check your phone for the SMS
5. Enter the OTP to complete authentication

## Troubleshooting

### Google OAuth Issues

- **"redirect_uri_mismatch"**: Check that your redirect URIs in Google Cloud Console match exactly
- **"access_denied"**: Ensure the OAuth consent screen is properly configured
- **"invalid_client"**: Verify your client ID and secret are correct

### SMS Issues

- **SMS not received**: Check Twilio logs in the console for delivery status
- **"Invalid credentials"**: Verify your Twilio Account SID and Auth Token
- **Rate limiting**: Wait 60 seconds between SMS sends during development

### General Issues

- **Environment variables not loaded**: Restart your development server after updating `.env.local`
- **Supabase connection issues**: Ensure `supabase start` completed successfully
- **CORS errors**: Check that your site URLs in `supabase/config.toml` are correct

## Production Deployment

When deploying to production:

1. Update the Google OAuth redirect URIs to include your production domain
2. Update the Supabase site URL in your project settings
3. Set the environment variables in your hosting platform
4. Ensure your production domain is added to Twilio's allowed domains (if applicable)

## Security Considerations

- Never commit your `.env.local` file to version control
- Use environment variable substitution in `supabase/config.toml`
- Regularly rotate your Twilio Auth Token
- Monitor OAuth usage in Google Cloud Console
- Set up proper rate limiting for production use