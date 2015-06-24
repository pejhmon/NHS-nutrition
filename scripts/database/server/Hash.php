<?php

/**
 * This class contains all of the functionality related to hashes and hashing. It is mainly used for the creation of hashes to be stored as passwords
 * and for the creation of salts. 
 * 
 * Created: 24th December 2014
 * @author Vikram Bakshi
 *
 */
class Hash
{
	
	/**
	 * Function makes a hash.
	 */
	public static function make($string, $salt='')
	{
		return hash('sha256', $string . $salt);
	}
	
	/**
	 * Function makes a salt of a given length. 
	 */
	public static function salt($length)
	{
		return mcrypt_create_iv($length);
	}

	/**
	 * Function calls the static function make whilst passing the first argument, $string as uniqid(). 
	 */
	public static function unique()
	{
		return self::make(uniqid());
	}
	
}

?>