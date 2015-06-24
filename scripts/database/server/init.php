<?php
/**
 * This PHP script is intended to be included in others. Instead of having to write countless require statements e.g. require_once 'DB.php'; require_once 'User.php'; etc.
 * the script includes an autoload function. It also contains the global array 'config' which stores details about the database, cookies, and session. 
 * Finally, the script checks whether the user has asked to be remembered i.e. if a cookie is present and if they are logged in. 
 * It goes on to log the user in if that is the desired outcome. 
 * 
 * Created 16th December 2014
 * @author Vikram Bakshi
 */

session_start(); 

/*
 * Creating a gloabl array for easy access to data.  
 */
$GLOBALS['config'] = array(
	'mysql' => array(
		'host' 			=> '127.0.0.1',
		'userName'	 	=> 'root',
		'passCode'	 	=> '',
		'db'	 		=> 'appetite'
	),
	'remember' => array(
		'cookie_name'	=> 'appetiteCookieHash',
		'cookie_name2'	=> 'appetiteCookieUserID',
		'cookie_expiry'	=> 315532800 //ten years in seconds
	), 
	'session' => array(
		'session_name'	=> 'user',
		'token_name'	=> 'token'
	)	
);

/**
 * Using the standard php library (spl) to autoload a class only when it is required. This saves having to write require_once '...' for each class in every script. 
 */
spl_autoload_register(function($class) 
{
	require_once $class.'.php';
});
    
require_once 'functions.php'; // Imports functions which should be accessible to scripts which use require_once 'init.php'. 

//if the cookie exists but the session does not - then the user asked to be remembered and so should be logged in.
if(Cookie::exists(Configurations::get('remember/cookie_name')) && !Session::exists(Configurations::get('session/session_name'))) 
{
	//echo '<br /> User asked to be remembered <br />'; //for debugging. 
	$hash = Cookie::get(Configurations::get('remember/cookie_name'));
	$hashCheck = DB::getInstance()->get('users_session', array('hash','=',$hash));
	
	if($hashCheck->count())
	{
		/* echo 'Hash Matches, log the user in.';
		echo '<br />'.$hashCheck->first()->user_id; */ //for debugging. 
		
		//if here then the user wanted to be remembered and so should be logged in
		$user = new User($hashCheck->first()->user_id); 
		$user->login(); 
	}
	
}

?>

