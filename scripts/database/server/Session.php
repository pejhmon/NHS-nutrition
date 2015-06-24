<?php
/**
 * The Session class contains all of the functionality required to manipulate the session of the user. This is useful for storing 
 * PHP variables across pages in the same user session. 
 * 
 * Created 23rd December 2014
 * @author Vikram Bakshi
 *
 */
class Session
{
	/**
	 * Returns true or false depening on whether the session exists or not. 
	 */
	public static function exists($name)
	{
		return (isset($_SESSION[$name])) ? true : false; 
	}

	/**
	 * Creates a session variable with the name, $name, and value, $value as based on the function arguments. 
	 */
	public static function put($name, $value)
	{
		return $_SESSION[$name] = $value;
	}
	
	/**
	 * Returns the value of the given session variable.
	 */
	public static function get($name)
	{
		return $_SESSION[$name];
	}
	
	/**
	 * Deletes the session variable defined by the given $name. 
	 */
	public static function delete($name)
	{
		if(self::exists($name))
		{
			unset($_SESSION[$name]);
		}
	}
}
?>
