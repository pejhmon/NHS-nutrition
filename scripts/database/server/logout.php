<?php

/**
 * This simple script is intended to log the user out. The user's details will be grabbed from session/cookie when creating the new User() object.
 * Created 23rd December 2014
 * @author Vikram Bakshi
 */

require_once 'init.php';

$user = new User();
$user->logout(); 

echo "You have logged out. You will be redirected in 5 seconds";
header( "refresh:5;url=/../nhs-nutrition-diary/nhs-nutrition-diary/WebContent/index.html" );


?>