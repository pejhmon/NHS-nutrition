<?php
/**
 * This class contains all of the functionality required for dealing with cookies - checking whether they exist, getting, putting and deleting them.
 * Created 24th December 2014
 * @author Vikram Bakshi
 */

class Cookie
{
	/**
	 * Checks whether a given cookie exists and returns either true or false.
	 */
	public static function exists($name)
	{
		return (isset($_COOKIE[$name])) ? true: false; 
	}	
	
	/**
	 * Returns the cookie specified in the argument ($name). 
	 */
	public static function get($name)
	{
		return $_COOKIE[$name];
	}
	
	/**
	 * Puts a cookie locally at the client side. 
	 */
	public static function put($name, $value, $expiry)
	{
		if(setcookie($name, $value, time() +$expiry, '/')) //set path to '/' so it is available over the entire domain. 
		{
			return true;
		}
		return false; 
	}
	
	/**
	 * Deletes the cookie from the the client side by setting the expiration to a past time. 
	 */
	public static function delete($name)
	{
		self::put($name, '', time() - 1);
	}
	
	
}
?>