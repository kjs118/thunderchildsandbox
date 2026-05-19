<?php
// contact-form.php — Thunder Child contact form handler

// ── Config ──────────────────────────────────────────────────
$to      = 'contact@thunderchildband.com'; // ← your email here
$subject = 'Thunder Child — New Booking Inquiry';

// ── Only process POST requests ───────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

// ── Collect and sanitize fields ──────────────────────────────
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val)));
}

$name         = clean($_POST['name']         ?? '');
$email        = clean($_POST['email']        ?? '');
$phone        = clean($_POST['phone']        ?? '');
$inquiry_type = clean($_POST['inquiry-type'] ?? '');
$event_date   = clean($_POST['event-date']   ?? '');
$message      = clean($_POST['message']      ?? '');

// ── Basic validation ─────────────────────────────────────────
$errors = [];
if (empty($name))              $errors[] = 'Name is required.';
if (empty($email))             $errors[] = 'Email is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Please enter a valid email address.';
if (empty($message))           $errors[] = 'Message is required.';

if (!empty($errors)) {
    $err = urlencode(implode(' ', $errors));
    header("Location: contact.html?status=error&msg=$err");
    exit;
}

// ── Build the email ──────────────────────────────────────────
$body = "
New booking inquiry from the Thunder Child website.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:         $name
Email:        $email
Phone:        " . ($phone ?: '—') . "
Inquiry Type: " . ($inquiry_type ?: '—') . "
Event Date:   " . ($event_date ?: '—') . "

Message:
$message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent from thunderchildband.com
";

// ── Headers — sets reply-to as the sender's email ────────────
$headers  = "From: Thunder Child Website <noreply@thunderchildband.com>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// ── Send ─────────────────────────────────────────────────────
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    header('Location: contact.html?status=success');
} else {
    header('Location: contact.html?status=error&msg=' . urlencode('Mail could not be sent. Please email us directly.'));
}
exit;
?>
