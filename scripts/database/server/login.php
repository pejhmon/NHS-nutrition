<?php
/**
 * This is the script which is run once the user clicks the login/sign in button. If any post data exists the data is validated against the requirements.
 * If the user validation is passed then user is logged in, otherwise errors are echoed to the user. 
 * 
 * Created 23rd December 2014
 * @author Vikram Bakshi 
 */

require_once 'init.php'; 

if(Input::exists('post'))
{	
	$validate = new Validate();
	$validation = $validate->check($_POST,array(
		'nhsnumber' => array(
					'required' => true,
					'min' => 5, //min length
					'max' => 15 //max length
				),
		'password'  => array('required' => true)
	));
	
	if($validation->passed())
	{
		$user = new User(); 
		$remember = (Input::get('remember') === 'remember') ? true:false; //did the user tick the remember me button?
		$login = $user -> login(Input::get('nhsnumber'), Input::get('password'), true);
		
		if ($login)
		{
			echo "<br />You have logged in successfully! You will be redirected in 5 seconds. <br/>
					If you are not redirected please ".'<a href="../../../home.html">'. 'click here'.'</a>';
			header( "refresh:5;url=../../../home.html");
		}
		else 
		{
			'Log In Failed. Please check your username/nhsnumber and password.';
		}
	} else 
	{
		foreach($validation -> getErrors() as $error)
		{
			echo $error,'<br />'; 
		}
	}
	
	
}


?>