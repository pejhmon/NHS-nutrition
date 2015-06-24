<?php
/**
 * This PHP file's purpose is to contain functions which are not suitable for any existing class and do not warrant the creation of an entire class to themselves. 
 * Any script which imports init.php will also gain access to these functions.   
 * 
 * Created 17th December 2014
 * @author Vikram Bakshi
 */

/**
 * This function uses the in built php htmlentities function to return a string converted into HTML entities. 
 * For example, the string "<script>" would be converted to "&lt;script&gt;" and if displayed on a website the <script> literal would not be run. 
 * This is included so that generated HTML does not contain runnable malicious scripts.    
 */
function escape($string)
{
	return htmlentities($string, ENT_QUOTES, 'UTF-8');
}

?>