# NeoDove CRM + WPForms Integration Guide

## Overview
This guide will help you integrate NeoDove CRM with WordPress WPForms using webhooks to automatically send all form submissions as leads to your CRM.

## Prerequisites
- WPForms plugin with Elite license (includes Webhooks addon)
- NeoDove CRM account with API access
- WordPress website with WPForms installed

## Step 1: Install and Activate WPForms Webhooks Addon

1. **Access WPForms Addons**
   - Go to your WordPress dashboard
   - Navigate to **WPForms » Addons**
   - Find and install the **Webhooks Addon**
   - Activate the addon

2. **Verify Installation**
   - The Webhooks option should now appear in your form settings

## Step 2: Get NeoDove CRM API Information

Before configuring the webhook, you'll need:

1. **NeoDove CRM API Endpoint**
   - Log into your NeoDove CRM account
   - Navigate to **Settings » Integrations » API**
   - Note down the API endpoint URL (typically something like: `https://api.neodove.com/v1/leads`)

2. **Authentication Details**
   - API Key or Token
   - Any required headers for authentication

## Step 3: Configure WPForms Webhook

1. **Access Form Settings**
   - Go to **WPForms » All Forms**
   - Edit the form you want to integrate
   - Click on the **Settings** tab
   - Select **Webhooks** from the left menu

2. **Enable Webhooks**
   - Toggle **Enable Webhooks** to "On"

3. **Configure Webhook Settings**
   - **Request URL**: Enter your NeoDove CRM API endpoint
   - **Request Method**: Select `POST`
   - **Request Format**: Select `JSON`
   - **Request Headers**: Add authentication headers if required

4. **Map Form Fields**
   - In the **Request Body** section, map your form fields to NeoDove CRM fields
   - Common mappings:
     - Name → `name` or `full_name`
     - Email → `email`
     - Phone → `phone` or `mobile`
     - Company → `company`
     - Message → `description` or `notes`

## Step 4: Sample Webhook Configuration

### Request Headers (if authentication required)
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### Request Body Mapping Example
```json
{
  "name": "{field_id_1}",
  "email": "{field_id_2}",
  "phone": "{field_id_3}",
  "company": "{field_id_4}",
  "source": "Website Form",
  "description": "{field_id_5}",
  "status": "New Lead"
}
```

## Step 5: Test the Integration

1. **Submit Test Form**
   - Fill out your form with test data
   - Submit the form

2. **Verify in NeoDove CRM**
   - Check your NeoDove CRM dashboard
   - Look for the new lead in your leads section
   - Verify all data is correctly mapped

## Step 6: Advanced Configuration (Optional)

### Conditional Logic
- Enable conditional logic if you want webhooks to trigger only under specific conditions
- Example: Only send to CRM if user selects "Interested in Services"

### Multiple Webhooks
- You can set up multiple webhooks for different purposes
- Example: One for leads, another for newsletter signups

## Troubleshooting

### Common Issues

1. **Webhook Not Triggering**
   - Check if WPForms Webhooks addon is properly activated
   - Verify the form has webhooks enabled
   - Check WordPress error logs

2. **Data Not Appearing in NeoDove CRM**
   - Verify the API endpoint URL is correct
   - Check authentication credentials
   - Ensure field mappings are correct
   - Check NeoDove CRM API logs

3. **Authentication Errors**
   - Verify API key/token is correct
   - Check if headers are properly formatted
   - Ensure your NeoDove CRM account has API access

### Debug Steps

1. **Enable WPForms Debug Mode**
   - Go to **WPForms » Settings » General**
   - Enable "Enable Debug Mode"

2. **Check Webhook Logs**
   - WPForms provides webhook delivery logs
   - Check these logs for any error messages

3. **Test API Endpoint**
   - Use tools like Postman to test your NeoDove CRM API endpoint
   - Verify it accepts the data format you're sending

## Field Mapping Reference

### Common NeoDove CRM Fields
- `name` - Full name
- `first_name` - First name
- `last_name` - Last name
- `email` - Email address
- `phone` - Phone number
- `mobile` - Mobile number
- `company` - Company name
- `title` - Job title
- `description` - Notes/description
- `source` - Lead source
- `status` - Lead status

### WPForms Field IDs
- Use `{field_id_X}` format where X is the field ID
- Field IDs can be found in the form builder when editing fields

## Best Practices

1. **Data Validation**
   - Ensure required fields are mapped
   - Validate email format in WPForms
   - Use proper field types for phone numbers

2. **Error Handling**
   - Set up email notifications for failed webhook deliveries
   - Monitor webhook success rates

3. **Security**
   - Use HTTPS for all API endpoints
   - Keep API keys secure
   - Regularly rotate authentication tokens

4. **Performance**
   - Test webhook response times
   - Consider rate limiting if you have high form submission volumes

## Support Resources

- **WPForms Documentation**: https://wpforms.com/docs/how-to-install-and-use-the-webhooks-addon-with-wpforms/
- **NeoDove CRM Support**: Contact your NeoDove CRM support team for API-specific questions
- **WordPress Debug**: Enable WordPress debug mode for detailed error logging

## Next Steps

After successful integration:
1. Monitor lead quality and conversion rates
2. Set up automated follow-up sequences in NeoDove CRM
3. Create custom fields in NeoDove CRM for additional form data
4. Consider setting up lead scoring based on form submissions
