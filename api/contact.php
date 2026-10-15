<?php
/**
 * WEG Events - Contact Form Handler
 * Processes inquiries and sends luxury formatted email notifications.
 */

// Enable error reporting during debugging if needed, suppressed for production
error_reporting(0);
header('Content-Type: application/json; charset=UTF-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. Please submit the form via POST.'
    ]);
    exit;
}

// 1. Anti-Spam Honeypot Check (Hidden field that bots fill in)
if (!empty($_POST['website']) || !empty($_POST['_gotcha'])) {
    // Silently succeed so bots don't know they are blocked
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your inquiry has been sent.'
    ]);
    exit;
}

// 2. Sanitize and Extract Input
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$event_date = isset($_POST['event_date']) ? trim(strip_tags($_POST['event_date'])) : 'Not specified';
$guest_count = isset($_POST['guest_count']) ? trim(strip_tags($_POST['guest_count'])) : 'Not specified';
$service = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : 'General Inquiry';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// 3. Validation
$errors = [];
if (empty($name)) {
    $errors[] = 'Please enter your name.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}
if (empty($phone)) {
    $errors[] = 'Please provide a contact phone number.';
}
if (empty($message)) {
    $errors[] = 'Please share a few details about your event vision.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// 4. Email Recipients & Settings
// Inquiries will be sent to the WEG Events inbox
$to_email = 'info@wegevents.com';
$from_email = 'no-reply@wegevents.et'; // Standard cPanel domain address
$subject = "💍 New Wedding Inquiry: " . $name . " — " . $service;

// 5. Luxury HTML Email Body for WEG Team
$email_body = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f6f2; color: #2a2a2a; margin: 0; padding: 20px; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e8e2d8; }
    .email-header { background: #5b1e28; color: #fdfaf6; padding: 30px; text-align: center; }
    .email-header h1 { font-family: 'Georgia', serif; margin: 0; font-size: 24px; letter-spacing: 2px; color: #dfbe7e; }
    .email-header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
    .email-content { padding: 30px; }
    .field-row { margin-bottom: 16px; border-bottom: 1px solid #f0ece3; padding-bottom: 12px; }
    .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8e8071; margin-bottom: 4px; font-weight: 600; }
    .field-value { font-size: 16px; color: #1f1f1f; }
    .message-box { background: #faf8f5; border-left: 3px solid #dfbe7e; padding: 15px; margin-top: 20px; font-style: italic; line-height: 1.6; }
    .email-footer { background: #fdfaf6; padding: 20px; text-align: center; font-size: 12px; color: #9c9284; border-top: 1px solid #eee7dd; }
  </style>
</head>
<body>
  <div class='email-wrapper'>
    <div class='email-header'>
      <h1>WEG EVENTS</h1>
      <p>New Client Inquiry Received</p>
    </div>
    <div class='email-content'>
      <div class='field-row'>
        <div class='field-label'>Client / Couple Name</div>
        <div class='field-value'><strong>" . htmlspecialchars($name) . "</strong></div>
      </div>
      <div class='field-row'>
        <div class='field-label'>Contact Phone / WhatsApp</div>
        <div class='field-value'><a href='tel:" . htmlspecialchars($phone) . "'>" . htmlspecialchars($phone) . "</a></div>
      </div>
      <div class='field-row'>
        <div class='field-label'>Email Address</div>
        <div class='field-value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
      </div>
      <div class='field-row'>
        <div class='field-label'>Service Interested In</div>
        <div class='field-value' style='color: #5b1e28; font-weight: bold;'>" . htmlspecialchars($service) . "</div>
      </div>
      <div class='field-row'>
        <div class='field-label'>Planned Event Date</div>
        <div class='field-value'>" . htmlspecialchars($event_date) . "</div>
      </div>
      <div class='field-row'>
        <div class='field-label'>Approximate Guest Count</div>
        <div class='field-value'>" . htmlspecialchars($guest_count) . " guests</div>
      </div>
      <div class='field-row' style='border-bottom: none;'>
        <div class='field-label'>Client Vision & Details</div>
        <div class='message-box'>" . nl2br(htmlspecialchars($message)) . "</div>
      </div>
    </div>
    <div class='email-footer'>
      Sent via the contact form on <a href='https://wegevents.et' style='color: #5b1e28;'>wegevents.et</a>
    </div>
  </div>
</body>
</html>
";

// 6. Email Headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: WEG Events Inquiry <" . $from_email . ">\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 7. Send the email
$mail_sent = mail($to_email, $subject, $email_body, $headers);

// 8. Auto-responder email to the Client
$client_subject = "Thank you for reaching out to WEG Events";
$client_body = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f6f2; color: #2a2a2a; margin: 0; padding: 20px; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e8e2d8; }
    .email-header { background: #5b1e28; color: #fdfaf6; padding: 30px; text-align: center; }
    .email-header h1 { font-family: 'Georgia', serif; margin: 0; font-size: 24px; color: #dfbe7e; }
    .email-content { padding: 30px; line-height: 1.8; font-size: 15px; color: #333; }
    .email-footer { background: #fdfaf6; padding: 20px; text-align: center; font-size: 12px; color: #9c9284; }
  </style>
</head>
<body>
  <div class='email-wrapper'>
    <div class='email-header'>
      <h1>WEG EVENTS</h1>
      <p style='margin: 8px 0 0; color: #fdfaf6;'>Bespoke Luxury Event Planning</p>
    </div>
    <div class='email-content'>
      <p>Dear <strong>" . htmlspecialchars($name) . "</strong>,</p>
      <p>Thank you for inquiring about your celebration with <strong>WEG Events</strong>. We have safely received your event details for <em>" . htmlspecialchars($service) . "</em>.</p>
      <p>Our lead planning team will review your date and vision, and we will be in touch with you within <strong>24 hours</strong> to discuss our packages or schedule a personalized consultation.</p>
      <p>In the meantime, feel free to explore our portfolio on <a href='https://wegevents.et/gallery' style='color: #5b1e28; font-weight: 600;'>our gallery page</a> or connect with us on Telegram at <a href='https://t.me/wegevents' style='color: #5b1e28; font-weight: 600;'>@wegevents</a>.</p>
      <p style='margin-top: 25px;'>Warm regards,<br><strong>The WEG Events Team</strong><br>Addis Ababa, Ethiopia</p>
    </div>
    <div class='email-footer'>
      © " . date('Y') . " WEG Events. All rights reserved. • <a href='https://wegevents.et' style='color: #5b1e28;'>wegevents.et</a>
    </div>
  </div>
</body>
</html>
";

$client_headers  = "MIME-Version: 1.0\r\n";
$client_headers .= "Content-type: text/html; charset=UTF-8\r\n";
$client_headers .= "From: WEG Events <" . $from_email . ">\r\n";
$client_headers .= "Reply-To: WEG Events <" . $to_email . ">\r\n";
mail($email, $client_subject, $client_body, $client_headers);

// 9. Return JSON response to frontend
echo json_encode([
    'status' => 'success',
    'message' => 'Thank you! Your inquiry has been sent to our planning team. We will be in touch within 24 hours.'
]);
exit;
