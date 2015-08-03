<?php
/**
 * This script is intended to control program flow between an AJAX request made by the client and the response given by the server. 
 * All responses given are JSON encoded. As part of the json sent to this script, an 'action' property needs to exist. Otherwise
 * an exception is thrown.   
 *   
 * Created 26th December 2014
 * @author Vikram Bakshi, Robert Juergens 
 */

require_once 'init.php'; //contains the class loader 
header('Content-Type: application/json'); //states that the response from this script will be JSON data. 

$db 			= 	DB::getInstance(); 			//Get a connection to the MySQL database. 
$data 			= 	Input::retrieveData();		//Retrieve the data being sent to this script through AJAX.
$dataDecoded 	= 	json_decode($data, true); 	//decode the json data with the true flag so that objects are converted into associative arrays. 

//If an action property is not set throw an exception.   
if(!isset($dataDecoded['action'])) 
{
	throw new Exception("An 'action' property needs to exist as a JSON property in the data sent to this script"); 
} else 
{
	$action = $dataDecoded['action']; //this will have the value, 'save'/'edit'/'delete'/'get' etc.
	unset($dataDecoded['action']);
}

//Extract certain values from the data received from the AJAX request and set them to a local variable. Then unset them so that only relevant values remain.  
if(isset($dataDecoded['table'])) 
{
	$table = $dataDecoded['table'];
	unset($dataDecoded['table']);
}
if(isset($dataDecoded['where'])) 
{
	$whereDecoded = $dataDecoded['where'];
	$where = explode(",", $whereDecoded); 
	unset($dataDecoded['where']);
}
if(isset($dataDecoded['number']))
{
	$number = $dataDecoded['number'];
	unset($dataDecoded['number']);
}
if(isset($dataDecoded['colForCount']))
{
	$colForCount = $dataDecoded['colForCount'];
	unset($dataDecoded['colForCount']);
}
if(isset($dataDecoded['groupBy']))
{
	$groupBy = $dataDecoded['groupBy'];
	unset($dataDecoded['groupBy']);
}
if(isset($dataDecoded['orderBy']))
{
	$orderBy = $dataDecoded['orderBy'];
	unset($dataDecoded['orderBy']);
}
if(isset($dataDecoded['ascOrDesc']))
{
	$ascOrDesc = $dataDecoded['ascOrDesc'];
	unset($dataDecoded['ascOrDesc']);
}
if(isset($dataDecoded['limit']))
{
	$limit = $dataDecoded['limit'];
	unset($dataDecoded['limit']);
}
//if the userHash property is set: query the DB to return the user_id and add that as a property to the dataDecoded array.
if(isset($dataDecoded['userHash'])) 
{
	$userHash 				= $dataDecoded['userHash'];
	$userID 				= (array) $db->action('SELECT `user_id`','users_session',array('hash','=',$userHash))->first();
	$dataDecoded['userID'] 	= $userID['user_id'];
	unset($dataDecoded['userHash']);
}

//This switch statement controls the request's program flow, depending on the defined action property. 
switch($action)
{
	case 'get':						get($db, $table, $where); break;
	case 'getUserProfile':			getUserProfile($db, $table, $where); break; 
	case 'getVisualisationData':	getUserData($db, $dataDecoded); break;
	case 'getLast':					getLast($db, $table, $where); break;
	case 'getMostFrequent':			getMostFrequent($db, $table, $where, $colForCount, $groupBy, $orderBy, $ascOrDesc, $limit); break; 
	case 'save': 					save($db,$table, $dataDecoded); break; 
	case 'confirmIDPassword':		confirmIDPassword($db, $dataDecoded); break;
	case 'usernameUnique':			usernameUnique($db, $dataDecoded); break;
	case 'getUserId':				getUserId($db, $dataDecoded); break;
}

/**
 * Returns the user ID. 
 */
function getUserId($db, $dataDecoded)
{
	$userID = json_encode(array("userID" => $dataDecoded['userID'])); 
	echo $userID;
}

/**
 * Save record into database. 
 */
function save($db, $table, $dataDecoded)
{
	$db->insert($table, $dataDecoded);
	echo json_encode(array()); //echo back an empty JSON string otherwise there will be an AJAX error. 
}


/**
 * Checks whether the provided username exists in the database already or not. 
 * Returns a JSON array depending on the result.
 */
function usernameUnique($db, $dataDecoded)
{
	$check = $db->get('users', array('nhsnumber','=',$dataDecoded['nhsnumber']));
	if($check->count()) { $trueOrFalse = array(); 					echo json_encode($trueOrFalse); } //echo empty array if not unique
	else				{ $trueOrFalse = array("tOrf" => "true"); 	echo json_encode($trueOrFalse); } //echo true if unique
}

/**
 * For a user to register as a dietician and gain access to extra priveledges they must enter a password in their registration form.
 * This function confirms whether that password is correct and then returns true or false depending on that. 
 */
function confirmIDPassword($db, $dataDecoded)
{
	//Compare the stored hashed password against the one generated from the password provided. 
	if(strcmp(Hash::make($dataDecoded['idPassword']), $db->action('SELECT password','groups',array('id','=','2'))->first()->password) == 0)
	{
		$trueOrFalse = array("tOrf" => "true");
		echo json_encode($trueOrFalse); 
	}
	else
	{
		$trueOrFalse = array();
		echo json_encode($trueOrFalse);
	}
}

/**
 * Utilises the DB class to prepare and run an SQL statement including the filters provided in the $where array. 
 * The result is echoed back as JSON.  
 */
function get($db, $table, $where) 
{
	$results = $db->get($table, $where)->results(); 
	echo json_encode($results);
}

/**
 * Returns a JSON array containing data of a specified user (all information relating to date interval and userID is set in the $dataDecoded array as key:value pairs).
 * The JSON array contains data from a number of tables defined in the getUserData() method in the DB class. 
 */
function getUserData($db, $dataDecoded)
{
	$queryResultArray = $db->getUserData($dataDecoded);
	echo json_encode($queryResultArray);
}

/**
 * This gets the profile data of the user. This data, as it is currently stored, is non-identifiable i.e. contains no names of users. 
 * The unicode value for the ',' character is used to build up the first argument to prevent the interpreter from thinking
 * the ',' means move to the next argument. The results of the query are echoed back to the client. 
 */
function getUserProfile($db, $table, $where)
{
	$comma = json_decode('"\u002C"');	//UTF representation of a comma so that it can be used in function arguments
	$results = $db->action("SELECT gender$comma dateofbirth$comma activitylevel", $table, $where)->results(); 
	echo json_encode($results);
}

/**
 * Echoes back JSON containing the last entry in a specified table for a given user (defined in the $where array). 
 * This is useful, for example, when returning the most recent requirement of a given user. 
 */
function getLast($db, $table, $where) 
{
	$results = $db->last($table, $where);
	echo json_encode($results);
}

/**
 * This method returns JSON containing the most frequent occuring symptoms/foods (depends on arguments) for a given user. 
 * @param $table 		Defines which table you would like summarised.
 * @param $colForCount 	Defines the column in the table you would like to count occurence of (result will be ordered descending based on count of this column).
 * @param $groupBy		Defines which field you would like to group the result by.
 * @param $limit		Defines the limit of the number of rows. For example 10 would mean you would want the top 10 most frequent.
 */
function getMostFrequent($db, $table, $where, $colForCount, $groupBy, $orderBy, $ascOrDesc, $limit)
{
	$results = $db->mostFrequent($table, $where, $colForCount, $groupBy, $orderBy, $ascOrDesc, $limit)->results();
	echo json_encode($results); 
}
?>