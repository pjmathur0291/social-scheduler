# Google Sheets Automation Setup Guide

## 🎯 Overview

Your Google Sheets integration is now fully automated! When you enter a sheet ID in the form settings, all form submissions will automatically be sent to that Google Sheet. You've already shared your sheet with the service account `social-scheduler-sheets@social-scheduler-sheet-data.iam.gserviceaccount.com`.

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Environment File

Create a `.env.local` file in your project root with these variables:

```env
# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=social-scheduler-sheets@social-scheduler-sheet-data.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Step 2: Get Your Private Key

1. Go to your Google Cloud Console
2. Navigate to the service account: `social-scheduler-sheets@social-scheduler-sheet-data.iam.gserviceaccount.com`
3. Download the JSON key file
4. Copy the `private_key` value from the JSON file
5. Replace `YOUR_ACTUAL_PRIVATE_KEY_HERE` in the `.env.local` file

### Step 3: Test the Integration

1. Go to your form builder
2. Enable "Google Sheets integration"
3. Enter your Google Sheet ID
4. Click "🧪 Test Google Sheets Integration"
5. If successful, you'll see a test row added to your sheet!

## 📋 How It Works

### Automatic Data Flow:
1. **User submits form** → Form data is captured
2. **System checks form settings** → Looks for Google Sheets configuration
3. **If enabled** → Automatically sends data to your specified Google Sheet
4. **Data is formatted** → Organized in columns with headers
5. **New row added** → Each submission creates a new row

### Data Structure in Google Sheets:
```
| Date (dd/mm/yy) | Name | Email | Phone | Message | Form ID | UTM Source | UTM Campaign | UTM | URL of the page |
|-----------------|------|-------|-------|---------|---------|------------|--------------|-----|-----------------|
| 18/01/25        | John | john@example.com | +1234567890 | Hello! | form-123 | google | campaign1 | cpc | https://example.com |
```

## 🛠️ Form Builder Configuration

### In the Form Builder:
1. **Go to Form Settings** (gear icon)
2. **Enable Google Sheets integration** (checkbox)
3. **Enter Google Sheet ID** (from the URL)
4. **Set Worksheet Title** (optional, defaults to "Form Submissions")
5. **Test the connection** (blue test button)
6. **Save the form**

### Google Sheet ID Format:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```
Copy the `[SHEET_ID]` part only.

## 🧪 Testing Your Setup

### Method 1: Form Builder Test Button
1. Open any form in the form builder
2. Go to Form Settings
3. Enable Google Sheets integration
4. Enter your sheet ID
5. Click "🧪 Test Google Sheets Integration"
6. Check your Google Sheet for a test row

### Method 2: API Test Endpoint
```bash
curl -X POST http://localhost:3000/api/test-sheets-integration \
  -H "Content-Type: application/json" \
  -d '{"spreadsheetId": "YOUR_SHEET_ID", "sheetName": "Form Submissions"}'
```

### Method 3: Submit a Real Form
1. Create a form with Google Sheets enabled
2. Submit the form
3. Check your Google Sheet for the new row

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Permission denied" error
- **Solution**: Make sure your Google Sheet is shared with `social-scheduler-sheets@social-scheduler-sheet-data.iam.gserviceaccount.com`
- **Check**: Go to your sheet → Share → Add the service account email as Editor

#### 2. "Invalid credentials" error
- **Solution**: Check your `.env.local` file
- **Verify**: The private key includes `\n` characters for line breaks
- **Format**: Private key should be wrapped in quotes

#### 3. "Sheet not found" error
- **Solution**: Verify the Google Sheet ID is correct
- **Check**: Copy the ID from the URL between `/d/` and `/edit`

#### 4. Environment variables not loading
- **Solution**: Restart your development server
- **Command**: `npm run dev` or `yarn dev`

### Debug Steps:
1. Check browser console for errors
2. Check server logs for detailed error messages
3. Test the connection using the test button
4. Verify environment variables are set correctly

## 📊 Data Mapping

### Form Fields → Google Sheets Columns:
- **First field** → Name column
- **Second field** → Email column  
- **Third field** → Phone column
- **Fourth field** → Message column
- **Additional fields** → Custom columns

### Automatic Data:
- **Timestamp** → Date (dd/mm/yy) column
- **Form ID** → Form ID column
- **UTM parameters** → UTM columns
- **Referrer** → URL of the page column

## 🔒 Security Notes

1. **Never commit** the `.env.local` file to version control
2. **Keep your private key** secure and don't share it
3. **The service account** only has access to sheets you explicitly share
4. **Form submissions** are still saved to your database even if Google Sheets fails

## 🎉 You're All Set!

Once configured, every form submission will automatically appear in your Google Sheet. The system is designed to be:
- **Automatic** - No manual intervention needed
- **Reliable** - Form data is saved even if Google Sheets is down
- **Flexible** - Works with any Google Sheet you share
- **Scalable** - Handles multiple forms and sheets

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Use the test button in the form builder
3. Check the server logs for detailed error messages
4. Verify your Google Sheet is properly shared with the service account

The integration is now fully automated and ready to use! 🚀
