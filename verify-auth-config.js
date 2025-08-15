#!/usr/bin/env node

// Simple verification script for auth configuration
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Auth Configuration...\n');

// Check if required files exist
const requiredFiles = [
  'supabase/config.toml',
  '.env.local',
  '.env.example',
  'src/lib/auth.ts',
  'src/lib/stores/auth.ts',
  'src/routes/auth/callback/+page.svelte',
  'src/routes/auth/callback/+page.server.ts',
  'AUTH_SETUP.md'
];

console.log('📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${file}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  if (!exists) allFilesExist = false;
});

// Check Supabase config for auth providers
console.log('\n⚙️  Checking Supabase configuration:');
try {
  const configContent = fs.readFileSync('supabase/config.toml', 'utf8');
  
  const googleEnabled = configContent.includes('[auth.external.google]') && 
                       configContent.includes('enabled = true');
  console.log(`  Google OAuth: ${googleEnabled ? '✅ Enabled' : '❌ Not enabled'}`);
  
  const smsEnabled = configContent.includes('enable_signup = true') &&
                    configContent.includes('[auth.sms.twilio]') &&
                    configContent.includes('enabled = true');
  console.log(`  SMS Authentication: ${smsEnabled ? '✅ Enabled' : '❌ Not enabled'}`);
  
  const siteUrlConfigured = configContent.includes('site_url = "http://localhost:5173"');
  console.log(`  Site URL configured: ${siteUrlConfigured ? '✅ Yes' : '❌ No'}`);
  
} catch (error) {
  console.log('  ❌ Error reading supabase/config.toml');
}

// Check environment variables
console.log('\n🔐 Checking environment variables:');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  const hasSupabaseUrl = envContent.includes('PUBLIC_SUPABASE_URL=');
  console.log(`  Supabase URL: ${hasSupabaseUrl ? '✅ Set' : '❌ Missing'}`);
  
  const hasSupabaseKey = envContent.includes('PUBLIC_SUPABASE_ANON_KEY=');
  console.log(`  Supabase Anon Key: ${hasSupabaseKey ? '✅ Set' : '❌ Missing'}`);
  
  const hasGoogleClientId = envContent.includes('GOOGLE_OAUTH_CLIENT_ID=');
  console.log(`  Google Client ID: ${hasGoogleClientId ? '✅ Set' : '❌ Missing'}`);
  
  const hasGoogleSecret = envContent.includes('GOOGLE_OAUTH_CLIENT_SECRET=');
  console.log(`  Google Client Secret: ${hasGoogleSecret ? '✅ Set' : '❌ Missing'}`);
  
  const hasTwilioSid = envContent.includes('TWILIO_ACCOUNT_SID=');
  console.log(`  Twilio Account SID: ${hasTwilioSid ? '✅ Set' : '❌ Missing'}`);
  
  const hasTwilioToken = envContent.includes('TWILIO_AUTH_TOKEN=');
  console.log(`  Twilio Auth Token: ${hasTwilioToken ? '✅ Set' : '❌ Missing'}`);
  
  const hasTwilioService = envContent.includes('TWILIO_MESSAGE_SERVICE_SID=');
  console.log(`  Twilio Message Service: ${hasTwilioService ? '✅ Set' : '❌ Missing'}`);
  
} catch (error) {
  console.log('  ❌ Error reading .env.local');
}

console.log('\n📋 Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
} else {
  console.log('❌ Some required files are missing');
}

console.log('\n🚀 Next steps:');
console.log('1. Follow AUTH_SETUP.md to configure Google OAuth and Twilio SMS');
console.log('2. Update your .env.local file with actual credentials');
console.log('3. Start Supabase: npx supabase start');
console.log('4. Start the dev server: npm run dev');
console.log('5. Test authentication at http://localhost:5173');

console.log('\n✨ Auth configuration verification complete!');