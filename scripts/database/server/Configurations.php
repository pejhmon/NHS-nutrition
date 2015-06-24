<?php
 
/**
 * The Configurations class contains a single get function which makes it easier to refer to the global array containing the configuration details of the database. 
 * Rather than using PHP native functionality (which can become slightly confusing with arrays inside arrays) the function allows you to refer to the contents of the array
 * like a directory structure e.g. Configurations::get('mysql/host') would get the host. Please see the global array defined in init.php to understand
 * what Configurations::get('mysql/host') is referring to. 
 * 
 * Created: 16th December 2014
 * @author Vikram Bakshi
 *
 */
class Configurations
{
	
	/**
	 * Allows reference to the global array containing configuration details through a directory structure instead of using native PHP functionality. 
	 * For example 'Configurations::get('mysql/host')'. 
	 */
	public static function get($path = null)
	{
		if($path)
		{
			$config = $GLOBALS['config'];
			$path = explode('/', $path);
			
			foreach($path as $bit)
			{
				if(isset($config[$bit])) 
				{
					$config = $config[$bit];
				}
			}
			return $config;
		}
		return false;
	}	
}
?>
