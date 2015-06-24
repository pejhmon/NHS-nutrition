<?php

/**
 * This class is used to calculate the initial requirements of user i.e. when they are registering.
 * These formulas were provided to our team by the dietician staff at Guy's and St Thomas' hospital. 
 * 
 * Created 07th January 2015
 * @author Vikram Bakshi
 */
class InitialRequirements
{
	// Private instance variables to hold user profile data and the requirement data. 
	private $gender,
			$weight,
			$age,
			$activityLevel,
			$calorieRequirement,
			$proteinRequirement,
			$fluidRequirement;
	
	/**
	 * The constructor calls methods in order to set the private instance variables. 
	 */
	public function __construct($gender, $weight, $age, $activityLevel)
	{
		$this->calculateCalories($gender, $weight, $age, $activityLevel);
		$this->calculateProtein($weight);
		$this->calculateFluid($weight);
	}

	/**
	 * Calorie requirements are dependent on whether the user is male or female so this methods switches on gender and calls
	 * the relevant methods. 
	 */
	private function calculateCalories($gender, $weight, $age, $activityLevel)
	{
		$genderLowerCase = mb_strtolower($gender);
		switch($genderLowerCase)
		{
			case "female": 	$this->calorieRequirement = ($this->calculateCaloriesFemale($weight, $age))*$activityLevel ; 	break;
			case "male":	$this->calorieRequirement = ($this->calculateCaloriesMale($weight, $age))*$activityLevel;		break;
		}
	}
	
	/**
	 * Calculates the calorie requirement for females.
	 */
	private function calculateCaloriesFemale($weight, $age)
	{
		if($age < 17) 				{ return (($weight*13.4) + 692); 	}
		if($age >= 17 && $age < 30) { return (($weight*14.8) + 487); 	}
		if($age >= 30 && $age < 60) { return (($weight*8.3)  + 846);  	}
		if($age >= 60 && $age < 75) { return (($weight*9.8)  + 687); 	}
		if($age >= 75) 				{ return (($weight*8.3)  + 624); 	}
	}

	/**
	 * Calculates the calorie requirement for males.
	 */
	private function calculateCaloriesMale($weight, $age)
	{
		if($age < 17) 				{ return (($weight * 17.7) + 657); 	} 
		if($age >= 17 && $age < 30) { return (($weight * 15.1) + 692); 	} 
		if($age >= 30 && $age < 60) { return (($weight * 11.5) + 873); 	} 
		if($age >= 60 && $age < 75) { return (($weight * 11.9) + 700); 	} 
		if($age >= 75) 				{ return (($weight * 8.3) + 820);	}
	}

	/**
	 * Calculates the protein requirement for the user. 
	 */
	private function calculateProtein($weight)
	{
		$this->proteinRequirement = $weight * 0.17 * 6.25;
	}
	
	/**
	 * Calculates the fluid requirement for the user.
	 */
	private function calculateFluid($weight)
	{
		if($weight <= 60) 	{ $this->fluidRequirement = $weight * 30; } 
		else 				{ $this->fluidRequirement = $weight * 35; }		
	}	
	
	/**
	 * Returns the user's calcualted calorie requirement.  
	 */
	public function getCalorieRequirement()
	{
		return $this->calorieRequirement;
	}
	
	/**
	 * Returns the user's calcualted protein requirement.
	 */
	public function getProteinRequirement()
	{
		return $this->proteinRequirement;
	}
	
	/**
	 * Returns the user's calcualted fluid requirement.
	 */
	public function getFluidRequirement()
	{
		return $this->fluidRequirement;
	}
}
?>