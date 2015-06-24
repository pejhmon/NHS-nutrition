<?php
/**
 * This class allows for the creation of a 'User' object to represent a user in the database.  
 * It contains the functionality to log the user in, log them out, to check whether they have the relevant permission
 * and more. 
 * 
 * Created 22nd December 2014
 * @author Vikram Bakshi
 *
 */

class User
{
	private $_db, //connection to the db. 
			$_data, //to store the user data. 
			$_sessionName,
			$_cookieName,
			$_cookieName2,
			$_isLoggedIn; 
	
	/**
	 * When an object of this class in instantiated the instance variables are set so that:
	 * - There is a connection to the singleton DB ($_db). 
	 * - The session name is retrieved from the global config array stored in init.php ($_sessionName).
	 * - The two cookie names are also retreived and stored in $_cookieName and $_cookieName2 - one cookie stores 
	 * 	 the user's ID (which is just a number i.e. purposefully non-identifiable) and the other cookie stores a hash which allows the user to stay logged in
	 *   (if they clicked the remember me button when logging in). 
	 */
	public function __construct($user = null)
	{
		$this->_db = DB::getInstance(); 
		$this->_sessionName = Configurations::get('session/session_name');
		$this->_cookieName = Configurations::get('remember/cookie_name'); //name for cookie storing the hash.
		$this->_cookieName2 = Configurations::get('remember/cookie_name2'); //name for cookie storing user ID. 
		
		if(!$user)
		{
			if(Session::exists($this->_sessionName))
			{
				$user = Session::get($this->_sessionName);
				if($this->find($user))
				{
					$this->_isLoggedIn = true; 
				} else
				{
					//TODO process logout
					//process logout
				}
			}
		} else
		{
			$this->find($user);
		}
	}
	
	/**
	 * Creates a user account.
	 */
	public function create($fields = array())
	{
		if(!$this->_db->insert('users', $fields))
		{
			//echo var_dump($fields); //For DEBUGGING
			throw new Exception('There was a problem creating an account.');
		}
	}
	
	/**
	 * Finds a user based on their nhsnumber. And sets $this->_data to the results. 
	 * If no result is found, the same search is conducted using the 'id' field. 
	 * Again, if no result is found then the method returns false. 
	 */
	public function find($user = null)
	{
		if($user)
		{
			$field = 'nhsnumber'; //logging in using nhsnumber. 
			$data = $this ->_db->get('users', array($field, '=', $user)); 
			
			if($data -> count()) //if searching on nhsnumber returned results then take that result and return true
			{
				$this->_data = $data->first();
				return true;
			} else //if it did not return results, search by id
			{
				$fieldId = 'id'; 
				$data2 = $this ->_db->get('users', array($fieldId, '=', $user));
				if($data2 -> count()) //if searching on id returned results then take that result and return true
				{
					$this->_data = $data->first();
					return true;
				}
			}
		}
		return false; 
	}
	
	
	/**
	 * This method logs the user in or returns a session if they are already logged in. If no arguments are passed it is assumed the user is logged in already 
	 * (i.e. their cookie stores a valid hash). Otherwise you pass the $username, $password, and whether or not the user asked to be remembered ($remember). 
	 * If the $username and hashed $password match that which is stored in the database the user is logged in. 
	 * If the user has clicked 'remember me' then a cookie is also stored with a hash in order to keep the user logged in.   
	 */
	public function login($username = null, $password = null, $remember=false)
	{
		if(!$username && !$password && $this->exists()) //if no username and password provided and the user exists. 
		{
			Session::put($this->_sessionName, $this->data()->id);   
		} else
		{
			$user = $this -> find($username);	//Otherwise, find the user. 
			if ($user)							
			{
				if($this->data()->password === Hash::make($password, $this->data()->salt)) //If the user is found then check the password against the hash saved in the DB. 
				{
					Session::put($this->_sessionName, $this->data()->id); 	//If the password was correct, put a session. 
					if($remember)											//If the user asked to be remembered then run this code block
					{
						$hash = Hash::unique();								//Create a unique hash. 
						
						//Check whether a hash exists in the 'users_session' table for that user already i.e. they have logged in previously and asked to be remembered. 
						$hashCheck = $this->_db->get('users_session', array('user_id', '=',$this->data()->id)); 
			
						if(!$hashCheck->count()) //if the row count of the query is 0 run this code.  
						{
							//Insert a hash into the database for the user. 
							$this->_db->insert('users_session',array( 
									'user_id' 	=> $this->data()->id,
									'hash' 		=> $hash
							));
						} else //If the query returned any number of rows. 
						{
							$hash = $hashCheck -> first()->hash; //Take the first row and the value stored for hash and save it in the local variable $hash. 
						}
						Cookie::put($this->_cookieName, $hash, Configurations::get('remember/cookie_expiry')); //store the hash in a cookie
						Cookie::put($this->_cookieName2,$this->data()->id , Configurations::get('remember/cookie_expiry')); //store the userID in a cookie 
					}
					return true;
				}
			}
		}
		return false; 
	}
	
	
	/**
	 * Returns true if the user has permission for a given $key.
	 * Example $keys are 'user','admin','moderator' etc.
	 */
	public function hasPermission($key)
	{
		//Retrieves the row in the database table 'groups' which corresponds to the group of the user. 
		$group  = $this->_db->get('groups', array('id','=',$this->data()->group));
		
		if($group->count())
		{
			//The value stored in the 'permissions' column in the database is JSON.
			//This decodes the JSON and stores it into a local variable as an associative array. 
			$permissions = json_decode($group->first()->permissions, true); 
			
			//If the $key argument applied as a key to the associative array is true then return true - the user has permission. 
			if($permissions[$key]==true)
			{
				return true;
			}
			return false; //otherwise return false; 
		}
	}
	
	/**
	 * Returns true or false depending on whether the _data instance variable has been set. 
	 */
	public function exists()
	{
		return (!empty($this->_data))? true: false;
	}
	
	/**
	 * This method logs the user out. It first deletes the user from the users_session table in the database and then
	 * deletes the session. Finally it deletes the cookie. 
	 */
	public function logout()
	{
		$this->_db->delete('users_session',array('user_id','=',$this->data()->id)); 
		Session::delete($this->_sessionName);
		Cookie::delete($this->_cookieName);
		Cookie::delete($this->_cookieName2);
	}
	
	/**
	 * Return the data stored in the instance variable. 
	 */
	public function data()
	{
		return $this->_data;
	}
	
	/**
	 * Returns the boolean _isLoggedIn instance variable. 
	 */
	public function isLoggedIn()
	{
		return $this->_isLoggedIn;
	}
	
}


?>