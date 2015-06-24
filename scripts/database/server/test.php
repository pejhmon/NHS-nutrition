<?php

/**
 * This is a TEST script for testing functionality of the other PHP scripts. 
 * 
 * DELETE THIS AFTER TESTING. 
 * 
 * 
 */

require_once 'init.php';

echo '<br />in test.php for the test m8<br />';

$db = DB::getInstance();

$results = $db->mostFrequent('userfoodmanifest', array('userid','=','1'), 'foodname', 'foodname', 3)->results();
echo "<br /> Printing the result <br />";
		var_dump($results);
/* 

$comma = json_decode('"\u002C"');
echo $comma; 
$sql = "SELECT group$comma test"; 
echo $sql;

$results5 = $db->get('users', array('id','=','6'))->results();
echo '<br /> Var dump of the set of results received from the database'.'<br />';
var_dump($results5).'<br />';
$results5JSON = json_encode($results5);
echo '<br /> The JSON encoded results: <br />'.$results5JSON.'<br />';



$results6 = $db->action("SELECT nhsnumber$comma dateofbirth", 'users', array('id','=','6'))->results();
echo '<br /> Var dump of the set of results received from the database'.'<br />';
var_dump($results6).'<br />';
$results6JSON = json_encode($results6);
echo '<br /> The JSON encoded results: <br />'.$results6JSON.'<br />';


$results4 = $db->get('usersymptommanifest', array('userid','=','6','datetime','>=','2014-12-22','datetime','<=','2014-12-25'))->results();
echo '<br /> Var dump of the set of results received from the database'.'<br />';
var_dump($results4).'<br />';
$results4JSON = json_encode($results4);
echo '<br /> The JSON encoded results: <br />'.$results4JSON.'<br />';


$results = $db->get('usersymptommanifest', array('userid','=','6'))->results();
echo '<br /> Var dump of the set of results received from the database'.'<br />';
var_dump($results).'<br />'; 
$resultsJSON = json_encode($results); 
echo '<br /> The JSON encoded results: <br />'.$resultsJSON.'<br />'; 



$results2 = $db->get('usersymptommanifest', array('userid','=','6','symptom','=','Constipation'))->results();
echo '<br /> Var dump of the set of results received from the database'.'<br />';
var_dump($results2).'<br />';
$results2JSON = json_encode($results2);
echo '<br /> The JSON encoded results: <br />'.$results2JSON.'<br />';


$results3 = $db->get('usersymptommanifest', array('userid','=','6','symptom','=','Constipation','comment','=','test comment'))->results();
echo '<br /> Var dump of the set of results received from the database'.'<br />';
var_dump($results3).'<br />';
$results3JSON = json_encode($results3);
echo '<br /> The JSON encoded results: <br />'.$results3JSON.'<br />';
 */

/* if(Session::exists('success'))
{
	echo Session::flash('success');
} */

//$user = DB::getInstance()->query('SELECT * FROM users WHERE nhsnumber = ?', array(
//		'nhsnumber' => 'newNHSNum1'));
/* 
$user = DB::getInstance()->insert('users',array('nhsnumber' => '1234567', 'dateofbirth' => '20141222', 'hashedsaltedpw' => 'hashedsaltedpw'));

if($user->error())
{
	echo 'error m8 m8';
}
else {
	echo "did it m8";
} */

 /* 



///FOR DISPLAYING SOMETHING WITH USER PERMISSION
$user = new User();

if($user->isLoggedIn())
{
	echo "<br />The user ". $user->data()->nhsnumber." is logged in <br />"; 
} else 
{
	echo "<br />No user is logged in<br />";
}

if($user->hasPermission('admin'))
{
	echo '<p> You are an admin </p>';
}
 if($user->hasPermission('user'))
{
	echo '<p> You are a standard user. </p>';
} 
if($user->hasPermission('moderator'))
{
	echo '<p> You are a moderator. </p>';
} */


?>

