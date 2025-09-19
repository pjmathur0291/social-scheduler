# Your NeoDove CRM + WPForms Integration Setup

## Your NeoDove CRM Integration Details

Based on the information you provided, here are your specific integration details:

- **Campaign Name:** CUSTOM_INTEGRATION-campaign
- **Integration Type:** PUSH
- **Platform:** aksias.com
- **Endpoint:** `https://aba49fa8-9b13-4f76-9406-0c18b7f58e46.neodove.com/integration/custom/12624de5-073d-4aef-bc37-812ffc78c2ec/leads`
- **Method:** POST
- **Headers:** Content-Type: application/json
- **Required Fields:** name, mobile, email, detail, detail2

## Step-by-Step WPForms Configuration

### 1. Install WPForms Webhooks Addon
- Go to your WordPress dashboard
- Navigate to **WPForms » Addons**
- Install and activate the **Webhooks Addon** (requires Elite license)

### 2. Configure Your Form Webhook

1. **Access Form Settings**
   - Go to **WPForms » All Forms**
   - Edit the form you want to integrate
   - Click on the **Settings** tab
   - Select **Webhooks** from the left menu

2. **Enable Webhooks**
   - Toggle **Enable Webhooks** to "On"

3. **Configure Webhook Settings**
   - **Request URL:** `https://aba49fa8-9b13-4f76-9406-0c18b7f58e46.neodove.com/integration/custom/12624de5-073d-4aef-bc37-812ffc78c2ec/leads`
   - **Request Method:** POST
   - **Request Format:** JSON
   - **Request Headers:** 
     ```
     Content-Type: application/json
     ```

4. **Map Form Fields (Request Body)**
   Configure the following field mappings:
   ```json
   {
     "name": "{field_id_1}",
     "mobile": "{field_id_2}",
     "email": "{field_id_3}",
     "detail": "{field_id_4}",
     "detail2": "{field_id_5}"
   }
   ```

### 3. Field Mapping Examples

#### For a Contact Form:
- **name** → Full Name field
- **mobile** → Phone/Mobile field
- **email** → Email field
- **detail** → Message/Description field
- **detail2** → Company field (or any additional info)

#### For a Lead Generation Form:
- **name** → Full Name field
- **mobile** → Phone field
- **email** → Email field
- **detail** → Requirements/Interests field
- **detail2** → Source/How did you hear about us field

### 4. Finding Field IDs in WPForms

1. In the form builder, click on any field
2. Look at the **Field Options** panel on the right
3. The field ID is shown at the top (e.g., "Field ID: 1")
4. Use this ID in your webhook mapping as `{field_id_1}`, `{field_id_2}`, etc.

## Testing Your Integration

### Method 1: Use the Test Script
1. Upload the `test-webhook-integration.php` file to your WordPress root directory
2. Visit: `https://yourdomain.com/test-webhook-integration.php`
3. Click "Run Integration Test"
4. Check your NeoDove CRM dashboard for the test lead

### Method 2: Test with Real Form
1. Submit a test entry through your WPForms form
2. Check the WPForms webhook delivery logs
3. Verify the lead appears in your NeoDove CRM

## Expected JSON Payload

When a form is submitted, WPForms will send data like this to NeoDove CRM:

```json
{
  "name": "John Doe",
  "mobile": "9509624540",
  "email": "john.doe@example.com",
  "detail": "Interested in your services",
  "detail2": "Website Form Submission"
}
```

## Troubleshooting

### Common Issues and Solutions

1. **Webhook Not Triggering**
   - Ensure WPForms Webhooks addon is activated
   - Check that webhooks are enabled for your form
   - Verify the form is published and active

2. **Data Not Appearing in NeoDove CRM**
   - Check the webhook URL is correct
   - Verify field mappings match your form fields
   - Check WPForms webhook delivery logs for errors

3. **Field Mapping Issues**
   - Ensure field IDs are correct (use the form builder to find them)
   - Check that required fields (name, mobile, email) are mapped
   - Verify the JSON format is correct

### Checking Webhook Logs in WPForms

1. Go to **WPForms » All Forms**
2. Click on your form
3. Go to **Entries** tab
4. Click on any entry
5. Look for "Webhook Delivery" section
6. Check for success/failure status and error messages

## Important Notes

- **No API Key Required:** Your NeoDove integration doesn't require authentication
- **Campaign Assignment:** All leads will go to your "CUSTOM_INTEGRATION-campaign"
- **Field Requirements:** Make sure to map at least name, mobile, and email fields
- **Update Endpoint:** For updating existing leads, use: `https://aba49fa8-9b13-4f76-9406-0c18b7f58e46.neodove.com/integration/custom/12624de5-073d-4aef-bc37-812ffc78c2ec/leads?update=true`

## Next Steps After Setup

1. **Test the Integration:** Submit test forms and verify leads appear in NeoDove CRM
2. **Monitor Performance:** Check webhook delivery success rates
3. **Set Up Follow-up:** Configure automated follow-up sequences in NeoDove CRM
4. **Customize Fields:** Add more fields to capture additional lead information
5. **Create Multiple Forms:** Set up different forms for different lead sources

## Support

If you encounter any issues:
1. Check the WPForms webhook delivery logs
2. Verify your NeoDove CRM campaign is active
3. Contact NeoDove CRM support if leads aren't appearing
4. Contact WPForms support for webhook-related issues

---

**Remember:** Remove the test script file (`test-webhook-integration.php`) from your server after testing is complete for security reasons.
