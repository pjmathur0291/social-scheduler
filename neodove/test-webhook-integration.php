<?php
/**
 * NeoDove CRM + WPForms Webhook Integration Test Script
 * 
 * This script helps test the webhook integration between WPForms and NeoDove CRM
 * Place this file in your WordPress root directory and access it via browser
 * 
 * Usage: https://yourdomain.com/test-webhook-integration.php
 */

// Configuration - Updated with your NeoDove CRM details
$neodove_api_url = 'https://aba49fa8-9b13-4f76-9406-0c18b7f58e46.neodove.com/integration/custom/12624de5-073d-4aef-bc37-812ffc78c2ec/leads';
$api_key = 'NOT_REQUIRED'; // No API key needed for this integration

// Sample form data (simulating WPForms submission)
$sample_data = [
    'name' => 'John Doe',
    'mobile' => '9509624540',
    'email' => 'john.doe@example.com',
    'detail' => 'Interested in your services',
    'detail2' => 'Website Form Submission'
];

/**
 * Send test data to NeoDove CRM
 */
function sendToNeoDove($url, $api_key, $data) {
    $headers = [
        'Content-Type: application/json'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    return [
        'response' => $response,
        'http_code' => $http_code,
        'error' => $error
    ];
}

/**
 * Test webhook integration
 */
function testWebhookIntegration() {
    global $neodove_api_url, $api_key, $sample_data;
    
    echo "<h1>NeoDove CRM + WPForms Webhook Integration Test</h1>";
    echo "<hr>";
    
    // Configuration is ready
    echo "<div style='color: green; background: #e6ffe6; padding: 10px; border-radius: 5px; margin: 10px 0;'>";
    echo "<strong>Configuration Ready:</strong> Using your NeoDove CRM integration endpoint.";
    echo "</div>";
    
    echo "<h2>Test Configuration</h2>";
    echo "<p><strong>API URL:</strong> " . htmlspecialchars($neodove_api_url) . "</p>";
    echo "<p><strong>API Key:</strong> " . substr($api_key, 0, 10) . "...</p>";
    
    echo "<h2>Sample Data Being Sent</h2>";
    echo "<pre>" . json_encode($sample_data, JSON_PRETTY_PRINT) . "</pre>";
    
    echo "<h2>Test Results</h2>";
    
    // Send test data
    $result = sendToNeoDove($neodove_api_url, $api_key, $sample_data);
    
    // Display results
    echo "<div style='margin: 10px 0;'>";
    echo "<p><strong>HTTP Status Code:</strong> " . $result['http_code'] . "</p>";
    
    if ($result['error']) {
        echo "<div style='color: red; background: #ffe6e6; padding: 10px; border-radius: 5px;'>";
        echo "<strong>cURL Error:</strong> " . htmlspecialchars($result['error']);
        echo "</div>";
    } else {
        if ($result['http_code'] >= 200 && $result['http_code'] < 300) {
            echo "<div style='color: green; background: #e6ffe6; padding: 10px; border-radius: 5px;'>";
            echo "<strong>Success!</strong> Data sent successfully to NeoDove CRM.";
            echo "</div>";
        } else {
            echo "<div style='color: orange; background: #fff3cd; padding: 10px; border-radius: 5px;'>";
            echo "<strong>Warning:</strong> Received HTTP " . $result['http_code'] . " response.";
            echo "</div>";
        }
    }
    
    echo "<h3>Response Details</h3>";
    echo "<pre>" . htmlspecialchars($result['response']) . "</pre>";
    echo "</div>";
    
    // Provide next steps
    echo "<h2>Next Steps</h2>";
    echo "<ol>";
    echo "<li>Check your NeoDove CRM dashboard to verify the test lead was created</li>";
    echo "<li>If successful, configure your WPForms webhook with the same settings</li>";
    echo "<li>Test with actual form submissions</li>";
    echo "<li>Monitor webhook delivery logs in WPForms</li>";
    echo "</ol>";
}

/**
 * Display WPForms webhook configuration instructions
 */
function displayWPFormsConfig() {
    echo "<h2>WPForms Webhook Configuration</h2>";
    echo "<div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
    echo "<h3>Step-by-Step Instructions:</h3>";
    echo "<ol>";
    echo "<li>Go to your WordPress dashboard</li>";
    echo "<li>Navigate to <strong>WPForms » All Forms</strong></li>";
    echo "<li>Edit the form you want to integrate</li>";
    echo "<li>Click on the <strong>Settings</strong> tab</li>";
    echo "<li>Select <strong>Webhooks</strong> from the left menu</li>";
    echo "<li>Toggle <strong>Enable Webhooks</strong> to 'On'</li>";
    echo "<li>Configure the following settings:</li>";
    echo "<ul>";
    echo "<li><strong>Request URL:</strong> " . htmlspecialchars($GLOBALS['neodove_api_url']) . "</li>";
    echo "<li><strong>Request Method:</strong> POST</li>";
    echo "<li><strong>Request Format:</strong> JSON</li>";
    echo "<li><strong>Request Headers:</strong> Content-Type: application/json, Authorization: Bearer YOUR_API_KEY</li>";
    echo "</ul>";
    echo "<li>Map your form fields to NeoDove CRM fields in the Request Body section</li>";
    echo "<li>Save the form settings</li>";
    echo "</ol>";
    echo "</div>";
}

// Run the test
if (isset($_GET['test'])) {
    testWebhookIntegration();
} else {
    echo "<h1>NeoDove CRM + WPForms Integration Test</h1>";
    echo "<p>This script helps test the webhook integration between WPForms and NeoDove CRM.</p>";
    echo "<p><a href='?test=1' style='background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Run Integration Test</a></p>";
    displayWPFormsConfig();
}

// Security note
echo "<div style='background: #fff3cd; padding: 10px; border-radius: 5px; margin: 20px 0;'>";
echo "<strong>Security Note:</strong> Remove this test file from your server after completing the integration test.";
echo "</div>";
?>
