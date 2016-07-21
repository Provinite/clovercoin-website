<?php
    include("captcha-secret.php");
    //validate captcha
    $captcha_result = false;
    try {
        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = ['secret'   => $captcha_secret,
                 'response' => $_POST['g-recaptcha-response'],
                 'remoteip' => $_SERVER['REMOTE_ADDR']
             ];

        $options = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data)
            ]
        ];

        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        $captcha_result = json_decode($result)->success;
    }
    catch (Exception $e) {
    }

    if ($captcha_result !== true) {
        header("Location: http://www.clovercoin.com/contact-error.html");
        die();
    }

    $to = "ajclovercoin@gmail.com";
    $client_ip = $_SERVER['HTTP_CLIENT_IP']?:($_SERVER['HTTP_X_FORWARDE‌​D_FOR']?:$_SERVER['REMOTE_ADDR']);
    $client_email = $_POST['email'];
    $subject = "Clover Coin Contact Form: " . $_POST['subject'];
    $message = $_POST['message'];

    if ($_POST['bonusfield'] != "" && $_POST['bonusfield'] != null) {
        header("Location: http://www.clovercoin.com/contact-error.html");
        die();
    }

    $body  = "Submission on   : " . date("Y-m-d H:i:s") . "\r\n";
    $body .= "Submission from : " . $client_email . "\r\n";
    $body .= "Client IP       : " . $client_ip . "\r\n";
    $body .= "Message Subject : " . $subject . "\r\n";
    $body .= "\r\n\r\n";
    $body .= $message;

    $headers   = array();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-type: text/plain; charset=iso-8859-1";
    $headers[] = "X-Mailer: PHP/".phpversion();
    $headers[] = "From: contactform@clovercoin.com";

    if (!mail($to, $subject, $body, implode("\r\n", $headers))) {
        header("Location: http://www.clovercoin.com/contact-error.html");
        die();
    } else {
        header("Location: http://www.clovercoin.com/contact-complete.html");
        die();
    }
?>
