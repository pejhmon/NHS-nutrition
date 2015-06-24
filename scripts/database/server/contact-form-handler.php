
<?php
/*include 'saveimage.php';
$image='<img src="'.$_POST['img_val'].'" />';
echo $image;
 
//Get the base-64 string from data
$filteredData=substr($_POST['img_val'], strpos($_POST['img_val'], ",")+1);
 
//Decode the string
$unencodedData=base64_decode($filteredData);
 
//Save the image
file_put_contents('img.png', $unencodedData);*/


require_once 'phpmailer/PHPMailerAutoload.php';
require_once 'init.php'; //contains the class loader

$data 			= Input::retrieveData();
$json_data 		= json_decode($data, true);
$messageHTML	= $json_data['html'];
$emailAddress 	= $json_data['emailAddress'];





$mail = new PHPMailer;

$message ="
<html>
<body bgcolor='#FFFFCC' text='#000000'>
<div align='center'>
<h1>GSST patient report</h1>

<div>
This report was generated and sent by 'Appetite', an app used by patients and Doctors
of Guy's and St. Thomas' Hospital
</div>
<div>
Date From: 12/12/14
Date To: 15/01/15
</div>
Start Weight: 80kg
Current Weight 90kg
Weight change in 1 month: 3.5%
Weight change in 3 month: 15.4%
Weight change in 6 month: 7.3%
Current requirements: 2340 kcal, 86 g protein, 1550 ml fluid
Most frequent symptoms: 1. Vomitting, 2. Loss of appetite, 3. Taste changes

</body>
</html>
";

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'patientgstt@gmail.com';                 // SMTP username
$mail->Password = 'group15nhs';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->From = 'from@example.com';
$mail->FromName = 'Patient Report';
$mail->addAddress($emailAddress);;     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');

$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Report from patient at GSTT';
$mail->Body    = $messageHTML;
$mail->AltBody = 'body...';

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}

?>

