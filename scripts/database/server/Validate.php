<?php
/**
 * This class contains all the functionality relating to validating input passed from the client to the server.
 * Shortly after creating this class, a team decision was made to conduct all of the validation client side, rendering this code
 * obsolete. It remains in case server side validation is to be introduced in the future.   
 * 
 * Created 22nd December 2014
 * @author Vikram Bakshi
 */

class Validate
{
	//private instance variables  
	private $_passed = false,
			$_errors = array(),
			$_db = null;
	
	public function __construct()
	{
		$this->_db = DB::getInstance(); //grab the singleton connection to the DB. 
	}
	
	/**
	 * This method is used to check whether the $source passed to it conforms to the given rules. 
	 * If it does not the addError method is called. 
	 */
	public function check($source, $items = array()) //The keys in the $items associative array must match the the keys passed in the $source array. 
	{
		foreach($items as $item => $rules) //$item will be each of the entries e.g. nhsnumber, password. $rules will be the array that governs each $item. see register.php.
		{
			foreach($rules as $rule => $rule_value)
			{
				$item = escape($item); //for sanitisation. imported from init.php and functionality is in functions.php.
				$value = trim($source[$item]); //get rid of whitespaces. 
				
				if($rule === 'required' && empty($value))
				{
					$this->addError("{$item} is required");
				} else if(!empty($value))
				{
					switch($rule)
					{
						case 'min': if(strlen($value)<$rule_value) { $this-> addError("{$item} must be a minimum of {$rule_value} characters"); }
							break;
						case 'max': if(strlen($value)>$rule_value) { $this-> addError("{$item} must be a maximum of {$rule_value} characters"); }
							break;
						case 'matches': if($value != $source[$rule_value]) { $this-> addError("{$rule_value} must match {$item}"); }
							break;
						case 'unique':
							$check = $this->_db->get($rule_value, array($item,'=',$value));
							if($check->count()) { $this -> addError("{$item} already exists"); }
							break;
					}
				}	
			}	
		}
		if(empty($this->_errors)) //if the errors array is empty at this point then all of the checks were passed.
		{
			$this->_passed = true;
		}
		
		return $this;
	}

	/**
	 * Adds an error to the errors array.
	 */
	private function addError($error)
	{
		$this->_errors[] = $error;
	}
	
	/**
	 * Public function used to retrieve the errors which occurred during the check method's execution.
	 */
	public function getErrors()
	{
		return $this->_errors;
	}
	
	/**
	 * Returns true if the check method passed or else false. 
	 */
	public function passed()
	{
		return $this->_passed;
	}
	
}
?>