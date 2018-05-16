<?php
if($_SERVER["REQUEST_METHOD"] == "POST") {

  $name = strip_tags(trim($_POST["name"]));
  $name = str_replace(array("\r","\n"),array(" "," "),$name);
  $teloremail = trim($_POST["tel-email"]);
  if(preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $teloremail) == true) {
    $telemail = filter_var($teloremail, FILTER_SANITIZE_EMAIL); 
  } elseif (preg_match('/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/',$teloremail) == true) {
    $telemail = filter_var($teloremail, FILTER_SANITIZE_NUMBER_INT);
  }

  // Check that data was sent to the mailer.
  if (empty($name) or empty($telemail)) {
  // Set a 400 (bad request) response code and exit.
  http_response_code(400);
  echo "Oops! There was a problem with your submission. Please complete the form and try again.";
  exit;
  }


  $recipient = "mel198629@gmail.com";
  $telemail_content .= "Телефон или email: $telemail\n\n";
  $subject='Заказы с сайта';

  $message ="<html><head><title>Сообщение с сайта  excruders info</title></head><body> 
          <table cellpadding='0' cellspacing='0'>
            <tr><td style='font-size:16px;>Имя</td><td style='font-size:14px;'>". $name ."</td></tr>
            <tr><td style='font-size:16px;>E-mail</td><td style='font-size:14px;'>". $telemail_content . "</td> </tr>
            </tr></table></body></html>";

  $headers  = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";           
            
  if (mail($recipient, $subject, $message, $headers)) {
    
  } else {
    // Set a 500 (internal server error) response code.
    http_response_code(500);
    echo "Oops! Something went wrong and we couldn't send your message.";
  }
}
?>