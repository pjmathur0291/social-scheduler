# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your form submissions.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Sheets document where you want to store form submissions

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `form-submissions-service`
   - Description: `Service account for form submissions to Google Sheets`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format and click "Create"
6. Download the JSON file and keep it secure

## Step 4: Share Google Sheet with Service Account

1. Open your Google Sheets document
2. Click the "Share" button
3. Add the service account email (from the JSON file) as an editor
4. The email will look like: `form-submissions-service@your-project.iam.gserviceaccount.com`

## Step 5: Get Google Sheet ID

1. Open your Google Sheets document
2. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
3. The Sheet ID is the long string between `/d/` and `/edit`

## Step 6: Configure Environment Variables

Add these environment variables to your `.env.local` file:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- The private key should include the `\n` characters for line breaks
- Wrap the entire private key in quotes
- The private key should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`

## Step 7: Configure Form Settings

1. Go to your form builder
2. Click "Form Settings"
3. Enable "Google Sheets integration"
4. Enter your Google Sheet ID
5. Optionally set a custom worksheet title
6. Save your form

## Step 8: Test the Integration

1. Submit a test form
2. Check your Google Sheets document
3. You should see a new row with the form submission data

## Troubleshooting

### Common Issues

1. **"Permission denied" error:**
   - Make sure you've shared the Google Sheet with the service account email
   - Verify the service account email is correct

2. **"Invalid credentials" error:**
   - Check that the environment variables are set correctly
   - Ensure the private key includes proper line breaks (`\n`)

3. **"Sheet not found" error:**
   - Verify the Google Sheet ID is correct
   - Make sure the sheet exists and is accessible

4. **"Worksheet not found" error:**
   - The system will create a new worksheet if it doesn't exist
   - Check that the worksheet title is correct

### Data Structure

The Google Sheets will contain the following columns:
- Timestamp
- Form ID
- Form Name
- UTM Source
- UTM Medium
- UTM Campaign
- UTM Term
- UTM Content
- UTM ID
- Referrer
- Landing Page
- All form field data

## Security Best Practices

1. **Never commit the service account JSON file to version control**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate your service account keys**
4. **Limit the service account permissions to only what's needed**
5. **Monitor your Google Cloud usage and costs**

## Support

If you encounter any issues, check the browser console and server logs for error messages. The integration is designed to fail gracefully - if Google Sheets is unavailable, form submissions will still be saved to your database.
