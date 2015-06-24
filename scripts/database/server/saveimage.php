<?php
//save.php code

//Show the image
$image='<img src="'.$_POST['img_val'].'" />';
echo $image;
echo exec('whoami'); 
 
//Get the base-64 string from data
$filteredData=substr($_POST['img_val'], strpos($_POST['img_val'], ",")+1);
 
//Decode the string
$unencodedData=base64_decode($filteredData);
 
//Save the image
file_put_contents('img.png', $unencodedData);
?>