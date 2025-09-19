# Social Scheduler Form Embed Integration Guide

## Overview

The Social Scheduler embed system allows you to display your forms on external websites, similar to how Calendly or other form services work. This guide will help you understand how to use and implement the embed functionality.

## Features

✅ **Cross-Domain Embedding** - Works on any website  
✅ **UTM Parameter Tracking** - Automatically captures marketing data  
✅ **Google Sheets Integration** - Submissions sync to your sheets  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Light/Dark Themes** - Customizable appearance  
✅ **Two Embed Types** - Iframe and inline options  
✅ **Real-time Submissions** - Instant lead capture  

## How to Generate Embed Code

### Step 1: Access Your Form
1. Log into your Social Scheduler dashboard
2. Navigate to **Forms Management**
3. Find the form you want to embed
4. Click the **"Embed"** button (green button with code icon)

### Step 2: Configure Embed Settings
- **Embed Type**: Choose between iframe or inline
- **Dimensions**: Set width and height (iframe only)
- **Theme**: Select light or dark theme
- **Preview**: See how your form will look

### Step 3: Copy Embed Code
- Click **"Copy Code"** to copy the generated HTML
- The code is ready to paste into any website

## Embed Types

### 1. Iframe Embed (Recommended)
```html
<!-- Social Scheduler Form Embed -->
<div id="social-scheduler-form-123" style="min-width: 320px; height: 600px;"></div>
<script type="text/javascript" src="https://your-domain.com/embed.js" async></script>
<script type="application/social-scheduler-embed">
{
  "type": "iframe",
  "formId": "form-123",
  "containerId": "social-scheduler-form-123",
  "width": "100%",
  "height": "600px",
  "theme": "light",
  "hideHeader": false
}
</script>
<!-- Social Scheduler Form Embed End -->
```

**Pros:**
- Isolated from your site's CSS
- Guaranteed to work on any website
- Easy to implement
- Automatic responsive behavior

**Cons:**
- Less styling control
- Fixed dimensions

### 2. Inline Form
```html
<!-- Social Scheduler Inline Form -->
<div id="social-scheduler-form-123"></div>
<script type="text/javascript" src="https://your-domain.com/embed.js" async></script>
<script type="application/social-scheduler-embed">
{
  "type": "inline",
  "formId": "form-123",
  "containerId": "social-scheduler-form-123",
  "theme": "light"
}
</script>
<!-- Social Scheduler Inline Form End -->
```

**Pros:**
- Full styling control
- Integrates with your site's design
- No iframe limitations
- Better for custom layouts

**Cons:**
- May conflict with your site's CSS
- Requires more testing

## Implementation Examples

### WordPress
1. Edit your page/post
2. Switch to HTML/Text editor
3. Paste the embed code where you want the form
4. Publish/Update

### Shopify
1. Go to Online Store > Themes
2. Click "Actions" > "Edit code"
3. Find the template where you want the form
4. Paste the embed code in the appropriate section

### Custom HTML Website
1. Open your HTML file in a text editor
2. Find where you want the form to appear
3. Paste the embed code
4. Save and upload to your server

### React/Next.js
```jsx
import { useEffect } from 'react';

export default function ContactPage() {
  useEffect(() => {
    // Load the embed script
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/embed.js';
    script.async = true;
    document.head.appendChild(script);

    // Configure the embed
    const configScript = document.createElement('script');
    configScript.type = 'application/social-scheduler-embed';
    configScript.textContent = JSON.stringify({
      type: 'iframe',
      formId: 'your-form-id',
      containerId: 'social-scheduler-form',
      width: '100%',
      height: '600px',
      theme: 'light'
    });
    document.head.appendChild(configScript);

    return () => {
      // Cleanup
      document.head.removeChild(script);
      document.head.removeChild(configScript);
    };
  }, []);

  return (
    <div>
      <h1>Contact Us</h1>
      <div id="social-scheduler-form"></div>
    </div>
  );
}
```

## Tracking and Analytics

### Automatic Tracking
The embed system automatically captures:
- **UTM Parameters**: `utm_source`, `utm_medium`, `utm_campaign`, etc.
- **Referrer**: The website that sent the visitor
- **Landing Page**: The exact URL where the form was submitted
- **Timestamp**: When the submission occurred
- **Form Data**: All form field responses

### UTM Parameter Usage
Add UTM parameters to your embed URLs to track marketing campaigns:

```
https://your-website.com/contact?utm_source=facebook&utm_medium=social&utm_campaign=summer2024
```

### Google Sheets Integration
If you have Google Sheets enabled for your form:
1. All submissions automatically sync to your sheet
2. UTM data is included in separate columns
3. Real-time updates as forms are submitted

## Customization Options

### Themes
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Modern, sleek design

### Dimensions (Iframe Only)
- **Width**: `100%`, `500px`, `auto`, etc.
- **Height**: `600px`, `auto`, `100vh`, etc.

### Styling (Inline Only)
You can add custom CSS to style inline forms:

```css
#social-scheduler-form-123 {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#social-scheduler-form-123 input,
#social-scheduler-form-123 textarea {
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}
```

## Troubleshooting

### Form Not Loading
1. Check that the form ID is correct
2. Verify the embed script URL is accessible
3. Ensure JavaScript is enabled
4. Check browser console for errors

### Styling Issues (Inline Forms)
1. Check for CSS conflicts
2. Use more specific selectors
3. Consider using iframe embed instead

### Submissions Not Appearing
1. Check your dashboard's "Leads" section
2. Verify Google Sheets integration is enabled
3. Check form settings for redirect URLs

### CORS Issues
The embed system includes proper CORS headers, but if you encounter issues:
1. Ensure you're using the correct domain
2. Check that the embed script is served over HTTPS
3. Verify the API endpoints are accessible

## Security Considerations

### Data Protection
- All form submissions are encrypted in transit
- Data is stored securely in your database
- No sensitive data is exposed in the embed code

### Access Control
- Only authenticated users can generate embed codes
- Form data is only accessible to form owners
- API endpoints include proper authentication

## Best Practices

### Performance
1. Use iframe embeds for better performance
2. Set appropriate dimensions to avoid layout shifts
3. Test on mobile devices

### User Experience
1. Place forms above the fold when possible
2. Use clear, descriptive form labels
3. Test the complete submission flow

### Marketing
1. Always include UTM parameters in your links
2. Use consistent naming for campaigns
3. Monitor submission rates and optimize

## Support

If you encounter any issues with the embed functionality:

1. Check this guide for common solutions
2. Review the browser console for error messages
3. Test with a simple HTML page first
4. Contact support with specific error details

## Example Implementation

See `embed-example.html` in your project root for a complete working example of both embed types.

---

**Ready to start embedding forms?** Go to your Social Scheduler dashboard and click the "Embed" button on any form to get started!
