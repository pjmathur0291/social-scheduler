(function() {
  'use strict';

  // Configuration
  const EMBED_BASE_URL = window.location.protocol + '//' + window.location.host;
  const SCRIPT_VERSION = '1.0.0';

  // Create embed widget
  function createEmbedWidget(config) {
    const {
      formId,
      containerId,
      width = '100%',
      height = '600px',
      theme = 'light',
      hideHeader = false
    } = config;

    // Find container element
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Social Scheduler Embed: Container element not found with ID:', containerId);
      return;
    }

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${EMBED_BASE_URL}/embed/form/${formId}`;
    iframe.style.width = width;
    iframe.style.height = height;
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    iframe.allowTransparency = 'true';
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';

    // Add theme class to container
    container.className = `social-scheduler-embed social-scheduler-theme-${theme}`;

    // Clear container and add iframe
    container.innerHTML = '';
    container.appendChild(iframe);

    // Handle iframe resize
    function handleResize(event) {
      if (event.origin !== EMBED_BASE_URL) return;
      
      if (event.data && event.data.type === 'resize') {
        iframe.style.height = event.data.height + 'px';
      }
    }

    // Listen for resize messages
    window.addEventListener('message', handleResize);

    // Add loading state
    iframe.onload = function() {
      container.classList.add('loaded');
    };

    // Add error handling
    iframe.onerror = function() {
      container.innerHTML = `
        <div style="
          padding: 20px;
          text-align: center;
          background: #f3f4f6;
          border-radius: 8px;
          color: #6b7280;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <p>Failed to load form. Please check your connection and try again.</p>
        </div>
      `;
    };

    return iframe;
  }

  // Create inline form (without iframe)
  function createInlineForm(config) {
    const {
      formId,
      containerId,
      theme = 'light'
    } = config;

    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Social Scheduler Embed: Container element not found with ID:', containerId);
      return;
    }

    // Add theme class
    container.className = `social-scheduler-embed social-scheduler-theme-${theme}`;

    // Show loading state
    container.innerHTML = `
      <div style="
        padding: 40px;
        text-align: center;
        background: #f9fafb;
        border-radius: 8px;
        color: #6b7280;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        "></div>
        <p>Loading form...</p>
      </div>
    `;

    // Add CSS animation
    if (!document.getElementById('social-scheduler-embed-styles')) {
      const style = document.createElement('style');
      style.id = 'social-scheduler-embed-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .social-scheduler-embed {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .social-scheduler-theme-dark {
          background: #1f2937;
          color: #f9fafb;
        }
        .social-scheduler-theme-light {
          background: #ffffff;
          color: #1f2937;
        }
      `;
      document.head.appendChild(style);
    }

    // Fetch form data
    fetch(`${EMBED_BASE_URL}/api/embed/form/${formId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          renderInlineForm(container, data.form, theme);
        } else {
          throw new Error(data.error || 'Failed to load form');
        }
      })
      .catch(error => {
        console.error('Social Scheduler Embed Error:', error);
        container.innerHTML = `
          <div style="
            padding: 20px;
            text-align: center;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            color: #dc2626;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">
            <p>Failed to load form: ${error.message}</p>
          </div>
        `;
      });
  }

  // Render inline form
  function renderInlineForm(container, formConfig, theme) {
    const isDark = theme === 'dark';
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#f9fafb' : '#1f2937';
    const borderColor = isDark ? '#374151' : '#e5e7eb';
    const inputBg = isDark ? '#374151' : '#ffffff';

    let formHTML = `
      <div style="
        background: ${bgColor};
        border: 1px solid ${borderColor};
        border-radius: 8px;
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <h2 style="
          color: ${textColor};
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 8px 0;
        ">${formConfig.name}</h2>
        <p style="
          color: ${isDark ? '#d1d5db' : '#6b7280'};
          margin: 0 0 24px 0;
        ">Please fill out the form below to get in touch with us.</p>
        
        <form id="social-scheduler-form" style="display: flex; flex-direction: column; gap: 16px;">
    `;

    // Add form fields
    formConfig.fields.forEach(field => {
      const fieldId = `field-${field.id}`;
      const required = field.required ? 'required' : '';
      const requiredStar = field.required ? '<span style="color: #ef4444;">*</span>' : '';

      switch (field.type) {
        case 'text':
        case 'email':
        case 'phone':
          formHTML += `
            <div>
              <label for="${fieldId}" style="
                display: block;
                color: ${textColor};
                font-weight: 500;
                margin-bottom: 4px;
              ">${field.label} ${requiredStar}</label>
              <input type="${field.type}" id="${fieldId}" name="${field.id}" ${required}
                style="
                  width: 100%;
                  padding: 12px;
                  border: 1px solid ${borderColor};
                  border-radius: 6px;
                  background: ${inputBg};
                  color: ${textColor};
                  font-size: 14px;
                  box-sizing: border-box;
                "
                placeholder="${field.placeholder || ''}"
              />
            </div>
          `;
          break;

        case 'textarea':
          formHTML += `
            <div>
              <label for="${fieldId}" style="
                display: block;
                color: ${textColor};
                font-weight: 500;
                margin-bottom: 4px;
              ">${field.label} ${requiredStar}</label>
              <textarea id="${fieldId}" name="${field.id}" ${required} rows="4"
                style="
                  width: 100%;
                  padding: 12px;
                  border: 1px solid ${borderColor};
                  border-radius: 6px;
                  background: ${inputBg};
                  color: ${textColor};
                  font-size: 14px;
                  box-sizing: border-box;
                  resize: vertical;
                "
                placeholder="${field.placeholder || ''}"
              ></textarea>
            </div>
          `;
          break;

        case 'select':
          formHTML += `
            <div>
              <label for="${fieldId}" style="
                display: block;
                color: ${textColor};
                font-weight: 500;
                margin-bottom: 4px;
              ">${field.label} ${requiredStar}</label>
              <select id="${fieldId}" name="${field.id}" ${required}
                style="
                  width: 100%;
                  padding: 12px;
                  border: 1px solid ${borderColor};
                  border-radius: 6px;
                  background: ${inputBg};
                  color: ${textColor};
                  font-size: 14px;
                  box-sizing: border-box;
                "
              >
                <option value="">${field.placeholder || 'Select an option'}</option>
                ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('')}
              </select>
            </div>
          `;
          break;
      }
    });

    formHTML += `
          <button type="submit" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
            Submit
          </button>
        </form>
        
        <div id="form-message" style="margin-top: 16px; display: none;"></div>
      </div>
    `;

    container.innerHTML = formHTML;

    // Add form submission handler
    const form = document.getElementById('social-scheduler-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Add tracking data
      const urlParams = new URLSearchParams(window.location.search);
      data.formId = formConfig.id;
      data.formName = formConfig.name;
      data.timestamp = new Date().toISOString();
      data.utmSource = urlParams.get('utm_source') || '';
      data.utmMedium = urlParams.get('utm_medium') || '';
      data.utmCampaign = urlParams.get('utm_campaign') || '';
      data.utmTerm = urlParams.get('utm_term') || '';
      data.utmContent = urlParams.get('utm_content') || '';
      data.utmId = urlParams.get('utm_id') || '';
      data.referrer = document.referrer || '';
      data.landingPage = window.location.href;

      try {
        const response = await fetch(`${EMBED_BASE_URL}/api/form-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          messageDiv.innerHTML = `
            <div style="
              background: #d1fae5;
              border: 1px solid #a7f3d0;
              color: #065f46;
              padding: 12px;
              border-radius: 6px;
              text-align: center;
            ">
              ✅ ${formConfig.settings.successMessage || 'Thank you! Your submission has been received.'}
            </div>
          `;
          form.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (error) {
        messageDiv.innerHTML = `
          <div style="
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
          ">
            ❌ Error: ${error.message}
          </div>
        `;
      } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        messageDiv.style.display = 'block';
      }
    });
  }

  // Initialize embed
  function init() {
    // Check for embed configurations in script tags
    const embedScripts = document.querySelectorAll('script[type="application/social-scheduler-embed"]');
    
    embedScripts.forEach(script => {
      try {
        const config = JSON.parse(script.textContent);
        
        if (config.type === 'iframe') {
          createEmbedWidget(config);
        } else if (config.type === 'inline') {
          createInlineForm(config);
        }
      } catch (error) {
        console.error('Social Scheduler Embed: Invalid configuration:', error);
      }
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.SocialSchedulerEmbed = {
    createWidget: createEmbedWidget,
    createInlineForm: createInlineForm,
    version: SCRIPT_VERSION
  };

})();
