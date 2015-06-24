<?php
/**
 * This script registers the user as a patient (group 1) or a dietician (group 2).  
 * 
 * Created 22nd December 2014
 * @author Vikram Bakshi
 * */


require_once 'init.php';


if($data = Input::retrieveData()) 
{
	$dataDecoded = json_decode($data, true); //decode the json data with the true flag so that the object is converted into an associative array. 
	
	/*
	 * A team decision was made to enforce all validation of user entry for registration at the client's side. 
	 * This was after I had written the functionality for validation on the server side. As such, below
	 * I have commented out the code that would have enforced validation at this stage on the server. I am including it 
	 * for demonstration purposes and hope that if it is needed in the future, the example code becomes useful. 
	 */
	$validate 	= new Validate();
	$validation = $validate -> check($dataDecoded, array()); 	//passing an empty array so that there are no conditions which need to be passed. Refer to commented out code 
																//below to see what type of array can be passed to enforce validation. 
	 
	 /*
	  * Code is commented out as it was decided validation would be done client side. 
	  * It is included for functionality demonstration purposes.  
		  
		  $validation = $validate -> check($dataDecoded, array(  //The array as the second parameter should contain the relevant conditions for each key in $dataDecoded
				'nhsnumber' => array( 
						'required' => true,
						'min' => 5, //min length
						'max' => 15, //max length
						'unique' => 'users'
				),
				'password' => array(
						'required' => true,
						'min' => 6,
				),
				'confirmpassword' => array(
						'required' => true,
						'matches' => 'password'
				),
				'weight' => array(
						'required' => true
				),
				'dob' => array(),
				'activitylevel' => array()
		));
	*/
	
	if($validation->passed()) //An empty array was passed as the conditions for validation so this will always be true (unless code commented above is amended). 
	{
		switch($dataDecoded['group'])
		{
			case 1: registerPatient($dataDecoded); 		break;
			case 2: registerDietician($dataDecoded); 	break; 
		}
	} else
	{
		print_r($validation->getErrors()); //output errors
	}
}

/**
 * Register a patient and store their details in the database. 
 */
function registerPatient($dataDecoded)
{
	$user 		= new User();
	$salt 		= Hash::salt(32);
	$regStatus 	= array("success" => false); //Will be changed to true if no exceptions are thrown. 
	
	try
	{
		//Create the user in the database
		$user->create(array(
				'nhsnumber' 			=> $dataDecoded['nhsnumber'],
				'password' 				=> Hash::make($dataDecoded['password'],$salt),
				'salt' 					=> $salt,
				'dateofbirth' 			=> $dataDecoded['dob'],
				'gender' 				=> $dataDecoded['gender'],
				'activitylevel' 		=> $dataDecoded['activitylevel'],
				'registrationtimestamp' => date('Y-m-d H:i:s'),
				'group' 				=> $dataDecoded['group']
		));
		
		//If the creation of the user is successful (i.e. an exception is not thrown), retrieve the auto incremented userID.
		$userID = DB::getInstance()->get('users', array('nhsnumber','=',$dataDecoded['nhsnumber']))->first()->id;

		//Insert the weight the user entered when registering into the weight manifest table.
		DB::getInstance()->insert('userweightmanifest',array(
		'userid'				=> $userID,
		'datetime' 				=> date('Y-m-d H:i:s'),
		'weight'				=> $dataDecoded['weight']
		));
	
		//Calculating current age of the user. 
		$dateNow 		= new DateTime("now"); 
		$dobTime 		= explode(" ", $dataDecoded['dob']); 	
		$dobDateTime	= new DateTime($dobTime[0]);
		$difference 	= $dobDateTime->diff($dateNow);
		$age 			= $difference->y; 
		
		//Calculating the Initial Requirements of the user based on their gender, weight and age. 
 		$requirements = new InitialRequirements($dataDecoded['gender'], $dataDecoded['weight'], $age, $dataDecoded['activitylevel']);
	 	
 		//Put the initial requirements in the database for that user. 
		DB::getInstance()->insert('userrequirementsmanifest',array(
		'userid'				=> $userID,
		'datetime' 				=> date('Y-m-d H:i:s'),
		'gender'				=> $dataDecoded['gender'],
		'weight'				=> $dataDecoded['weight'],
		'activitylevel'			=> $dataDecoded['activitylevel'],
		'formulacalories'		=> $requirements->getCalorieRequirement(),
		'formulaprotein'		=> $requirements->getProteinRequirement(),
		'formulafluid'			=> $requirements->getFluidRequirement(),
		'finalcalories'			=> $requirements->getCalorieRequirement(), 	//For the initial setting of the requirements at registration the dietician will not be adding
		'finalprotein'			=> $requirements->getProteinRequirement(),	//any additional protein/cals/fluid, so these should be recorded as the same. 
		'finalfluid'			=> $requirements->getFluidRequirement()
		)); 
		
		//Now that a user has been created, log them in.
		$login = $user -> login($dataDecoded['nhsnumber'], $dataDecoded['password'], true);
		
		//If an exception is not thrown by this point, then the registration was successful.
		$regStatus['success'] = true;
	} catch(Exception $e)
	{
		echo ($e->getMessage());
	} finally {
		echo json_encode($regStatus);
	}
}

/**
 * Register a dietician and store their details in the database.
 */
function registerDietician($dataDecoded)
{
	$user 		= new User();
	$salt 		= Hash::salt(32);
	$regStatus 	= array("success" => false);
	
	try
	{
		//Create the user in the database
		$user->create(array(
				'nhsnumber' 			=> $dataDecoded['nhsnumber'],
				'password' 				=> Hash::make($dataDecoded['password'],$salt),
				'salt' 					=> $salt,
				'registrationtimestamp' => date('Y-m-d H:i:s'),
				'group' 				=> $dataDecoded['group'],
				'dateofbirth'			=> null,
				'gender' 				=> null,
				'activitylevel' 		=> null
		));
				
		//Now that a user has been created, log them in.
		$login = $user -> login($dataDecoded['nhsnumber'], $dataDecoded['password'], true);
		
		//If an exception is not thrown by this point, then the registration was successful. 
		$regStatus['success'] = true;
		 
	} catch(Exception $e)
	{
		echo ($e->getMessage());
	} finally {
		echo json_encode($regStatus);
	}
}

?>