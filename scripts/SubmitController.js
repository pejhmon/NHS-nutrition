function SubmitController() {}

SubmitController.prototype.submit = function(submitter) {

	switch(submitter) {
		case 'btn_submit_userSignUpDetails': 		this.submitUserSignUpDetails(); break; 
		case 'btn_submit_dieticianSignUpDetails': 	this.submitDieticianSignUpDetails(); break;
		case 'btn_submit_foods': 					this.submitFoods(); break;
		case 'btn_submit_newFood': 					this.submitNewFood(); break;
		case 'btn_save_meals': 						this.submitMeal(); break;
		case 'btn_submit_symptoms': 				this.submitSymptoms(); break;
		case 'btn_save_newCustomSymptom': 			this.submitNewCustomSymptom(); break;
		case 'btn_submit_weight': 					this.submitWeight(); break;
		case 'btn_submit_settings': 				this.submitSettings(); break;
		case 'emailButton':							this.submitEmail(); break;
		case 'log_out':								this.logOut(); break;
		default: 									console.log("in default case"); break;
	}
}

SubmitController.prototype.getUserID = function() {
	
	var hash = Cookies.prototype.getUserHash(); 
	
	var getUserID = 
	{
			"action": "getUserId",
			"userHash": hash
	};
	var userInfoResponseJSON = ServerDBAdapter.prototype.get(getUserID);
	var userID = userInfoResponseJSON['userID'];
	return userID;
}

SubmitController.prototype.logOut = function()
{
	window.location.href = "scripts/database/server/logout.php";
}


SubmitController.prototype.formatDateOnly = function(date) {
	var dateFormatted = "";
	var validator = new Validator();
	var dateParts = validator.dateSplit(date);
	dateFormatted = dateFormatted + dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
	
	return dateFormatted;
}

SubmitController.prototype.formatDateTime = function(date, time) {
	var dateTime = "";
	var validator = new Validator();
	var dateParts = validator.dateSplit(date);
	dateTime = dateTime + dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
	
	if(time != null) {
		dateTime = dateTime + " " + time + ":00"; 
	} else {
		dateTime += " 00:00:00";
	}
	
	return dateTime;
}

SubmitController.prototype.getAge = function(dateOfBirth) {
	var today = new Date();
	var dateOfBirthParts = dateOfBirth.split(' ');
	var dateOfBirthYMD = dateOfBirthParts[0].split('-');
	var month = "" + dateOfBirthYMD[1];
	var monthCleared = month.replace("0", "");
	var birthDate = new Date(dateOfBirthYMD[0], parseInt(dateOfBirthYMD[1]) - 1, dateOfBirthYMD[2]);
    
	var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

SubmitController.prototype.submitEmail = function()
{
	console.log("You clicked the email button");
	
	var dataToServer = 
	{
		"emailAddress": $('#email_address').val(),
		"html":			$('#summary').html()
	}
	
	ServerDBAdapter.prototype.submit(dataToServer, 'email');
	
}



/**
 * Once migrated to a permanent server, this function would need to be implemented using SSL. 
 */
$(document).ready(function() 
{

	$('#patient_registration_form').on('submit',(function (e) 
	{
        e.preventDefault();
		console.log("Im at the jquery bit for the patient reg form");  
		
		SubmitController.prototype.submitUserSignUpDetails();
		 
	}));
	
	$('#dietician_registration_form').on('submit',(function (e) 
	{
        e.preventDefault();
        console.log("Im at the jquery bit for the dietician reg form");  
		
		SubmitController.prototype.submitDieticianSignUpDetails();
		 
	}));
});

/**
 * Once migrated to a permanent server, this function would need to be implemented using SSL. 
 */
SubmitController.prototype.submitUserSignUpDetails = function() 
{
	console.log("Trying to submit user's details for sign up.");
	
	var nhsNumber		= $('#nhsnumber').val();
	var password 		= $('#password_user').val();
	var passwordConfirm = $('#password_confirm_user').val();
	var weight 			= $('#weight').val();
	var dob 			= $('#dob').val();
	var activityLevel 	= $('#activity_level').val();
	var gender 			= $('input[name="user_basic[sex]"]:checked').val();
	
	var errors			= "";
	// validations
	
	//if(!Validator.prototype.isValidNhsNumber(nhsNumber)) 		{ errors += '-> Please enter a valid NHS number.\n';					} 
	if(Validator.prototype.isEmpty(password)) 					{ errors += '-> Please enter a password.\n'; 							} 
	if(!Validator.prototype.isSame(password, passwordConfirm)) 	{ errors += '-> Password and confirmed password must be the same.\n';	}
	if(!Validator.prototype.isPositiveNumber(weight)) 			{ errors += '-> Please enter a valid weight (positive number).\n'; 		}
	if(!Validator.prototype.isValidDate(dob)) 					{ errors += '-> Please enter a valid date of birth.\n'; 				}
	if(!Validator.prototype.isInPastDateOfBirth(dob)) 			{ errors += '-> Date of birth cannot be a future date.\n'; 				}		 
	if(!Validator.prototype.isValidActivityLevel(activityLevel)){ errors += '-> Please enter a valid activity level between 1 (low) and 2 (high).\n';}
	if(!Validator.prototype.isValidGender(gender)) 				{ errors += '-> Please select a gender.\n'; 							}

	if(errors) 
	{ 
		var errorMsg = "Registration Failed. Please address the following issues and try again: \n\n" + errors;
		alert(errorMsg); 
		return;
	}
	
	var dateOfBirth = this.formatDateTime(dob, null);
	
	var userSignUpDetails = 
	{
			"action":			"register",
			"group":			1,
			"nhsnumber": 		nhsNumber,
			"password": 		password,
			"confirmpassword": 	passwordConfirm,
			"weight": 			weight,
			"dob": 				dateOfBirth,
			"activitylevel": 	activityLevel,
			"gender": 			gender
	}
	
	var status = ServerDBAdapter.prototype.submit(userSignUpDetails, 'register');
	console.log("prining status at end of submit controller");
	console.log(status); 
	if (status['success'] === true)
	{
		this.successMessage("Registration Successful. You will be redirected in 2 seconds.",2000, "home");
	}
	else
	{
		alert("Registration Failed. Please check your internet connection.")
	}
}

/**
 * Once migrated to a permanent server, this function would need to be implemented using SSL. 
 */
SubmitController.prototype.submitDieticianSignUpDetails = function() 
{
	console.log("Trying to submit dietician's details for sign up."); 
	
	var idNumber			= $('#identifing_number').val();
	var idPassword		 	= $('#identifying_password').val();
	var password 			= $('#password_dietician').val();
	var passwordConfirm 	= $('#password_confirm_dietician').val();
	
	var errors			= "";
	// validations
	
	if(!Validator.prototype.isValidUserName(idNumber)) 			{ errors += '-> Your username is already registered. If you have forgotten your'
																			+	' password please contact the system administrator.\n';			}
	//if(!Validator.prototype.isValidUserNameFormat(idNumber))	{ errors += '-> Your username is not valid. It must have the format \'DTXXXXX\' where' 
	//																		+	' \'X\' is a digit from 0 to 9.\n';									}
	if(!Validator.prototype.isIdentifyingPassword(idPassword)) 	{ errors += '-> Please enter the correct dietician registration password.\n'; 	}
	if(Validator.prototype.isEmpty(password)) 					{ errors += '-> Please enter a password.\n'; 									} 
	if(!Validator.prototype.isSame(password, passwordConfirm)) 	{ errors += '-> Password and confirmed password must be the same.\n';			}
	
	if(errors) 
	{ 
		var errorMsg = "Registration  Failed. Please address the following issues and try again: \n\n" + errors;
		alert(errorMsg); 
		return;
	}
	
	
	var dieticianSignUpDetails = 
	{
			"action":			"register",
			"group":			2,
			"nhsnumber": 		idNumber,
			"password": 		password,
			"confirmpassword": 	passwordConfirm,
	}
	
	
	var status = ServerDBAdapter.prototype.submit(dieticianSignUpDetails, 'register');
	
	if (status['success'] === true)
	{
		this.successMessage("Registration Successful. You will be redirected in 2 seconds.",2000, "home");
	}
	else
	{
		alert("Registration Failed. Please check your internet connection.")
	}
}

SubmitController.prototype.updateRequirements = function() {
	var table = "userrequirementsmanifest";
	
	var userId = this.getUserID();
	var date = new Date();
	var dateTime = this.formatDateTime(date.dateFormat('d/m/Y'), date.dateFormat('H:i'));
	
	var weightRequestJSON = {
			"action": "getLast",
			"table": "userweightmanifest",
			"where": "userid,=," + userId + ",swollenfeet,=,0,swollenlegs,=,0,swollenabdomen,=,0"
	};
	var weight = ServerDBAdapter.prototype.get(weightRequestJSON).weight;
	
	var userInfoRequestJSON = {
			"action": "getUserProfile",
			"table": "users",
			"where": "id,=," + userId
	};
	var userInfoResponseJSON = ServerDBAdapter.prototype.get(userInfoRequestJSON)[0];
	
	var gender = userInfoResponseJSON.gender;
	var dateOfBirth = userInfoResponseJSON.dateofbirth;
	var activityLevel = userInfoResponseJSON.activitylevel;

	var age = this.getAge(dateOfBirth);
	
	var previousRequirementsRequestJSON = {
			"action": "getLast",
			"table": "userrequirementsmanifest",
			"where": "userid,=," + userId
	};
	var previousRequirements = ServerDBAdapter.prototype.get(previousRequirementsRequestJSON);
	var additionalActivity = 0;
	var additionalCalories = 0;
	var additionalProtein = 0;
	var additionalFluid = 0;
	if(previousRequirements != null) {
		additionalActivity = Math.round(parseFloat(previousRequirements.additionalactivitylevel));
		additionalCalories = Math.round(parseFloat(previousRequirements.additionalcalories));
		additionalProtein = Math.round(parseFloat(previousRequirements.additionalprotein));
		additionalFluid = Math.round(parseFloat(previousRequirements.additionalfluid));
	}
	var finalActivityLevel = parseFloat(activityLevel) + parseFloat(additionalActivity);
	var requirementsCalculator = new RequirementsCalculator();
	var formulaCalories = Math.round(requirementsCalculator.calcCalories(gender, weight, age));
	var formulaProtein = Math.round(requirementsCalculator.calcProtein(weight, age));
	var formulaFluid = Math.round(requirementsCalculator.calcFluid(weight, age));
	var finalCalories = Math.round(parseFloat(formulaCalories) * finalActivityLevel + parseFloat(additionalCalories));
	var finalProtein = Math.round(parseFloat(formulaProtein) * finalActivityLevel + parseFloat(additionalProtein));
	var finalFluid = Math.round(parseFloat(formulaFluid) * finalActivityLevel + parseFloat(additionalFluid));
	
	var dataToServer = {
		"table": table,
		"userid": userId,
		"datetime": dateTime,
		"gender": gender,
		"weight": weight,
		"activitylevel": activityLevel,
		"formulacalories": formulaCalories,
		"formulaprotein": formulaProtein,
		"formulafluid": formulaFluid,
		"additionalcalories": additionalCalories,
		"additionalprotein": additionalProtein,
		"additionalfluid": additionalFluid,
		"additionalactivitylevel": additionalActivity,
		"finalcalories": finalCalories,
		"finalprotein": finalProtein,
		"finalfluid": finalFluid
	};
	
	ServerDBAdapter.prototype.submit(dataToServer, "save");
}

SubmitController.prototype.submitFoods = function() {
	var table = "userfoodmanifest"; 
	
	var userid = this.getUserID();
	var date = $('#Date').val();
	var time = $('#Time').val();
	
	// validations
	if(!Validator.prototype.isValidDate(date)) 			{ alert('Please enter a valid date.'); return; } 
	if(!Validator.prototype.isInPastDateOfBirth(date)) 	{ alert('Date cannot be a future date.'); return; }
	
	var dateTime = this.formatDateTime(date, time);
	var meal = "";	
	//var foodList =[];
	//var counter = 0;
	$('.selection-list li').each(function(idx, li) {
		var food  = $(li).data('data');
		//var foodLabel = food['foodname'];
		//foodLabel = foodLabel.replace(/,/g, "COMMA");
		//var quantity = food['quantity'];
		//counter++;
		var dataToServer = {
				"table": table,
				"userid": userid,
				"datetime": dateTime,
				"foodtable": "userfoodlist",
				"foodcode": food['foodcode'],
				"foodname": food['foodname'].replace(/,/g, "COMMA"),
				"quantity": food['quantity'],
				"energy_kcal": food['energy_kcal'],
				"protein_g": food['protein_g'],
				"water_g": food['water_g'],
				"edibleproportion":food['edibleproportion'],
				"carbohydrate_g": food['carbohydrate_g'],
				"fat_g": food['fat_g'],
				"meal": meal
		};
		
		ServerDBAdapter.prototype.submit(dataToServer, "save");
	});
	
	/*	var foodDetailsRequestJSON = {
	"action": "get",
	"table": "foodlist",
	"where": "foodname,=," + foodLabel		
};

var foodDetails = ServerDBAdapter.prototype.get(foodDetailsRequestJSON)[0];

if(foodDetails != null) {
foodTable = "foodlist";

foodId = foodDetails.foodcode;
foodName = foodDetails.foodname;
calories = foodDetails.energy_kcal;
protein = foodDetails.protein_g;
fluid = foodDetails.water_g;
carbohydrates = foodDetails.carbohydrate_g;
fat = foodDetails.fat_g;
} else {

var userFoodDetailsRequestJSON = {
		"action": "get",
		"table": "userfoodlist",
		"where": "userid,=," + userid + ",foodname,=," + foodLabel
};
var userFoodDetails = ServerDBAdapter.prototype.get(userFoodDetailsRequestJSON)[0];
foodTable = "userfoodlist";
foodId = userFoodDetails.id;
foodName = userFoodDetails.foodname;
calories = userFoodDetails.calories;
protein = userFoodDetails.protein;
fluid = userFoodDetails.fluid;
fat = userFoodDetails.fat;
}*/
	this.successMessage("Foods submitted.",2000,"home");
}

SubmitController.prototype.submitNewFood = function() {
	var table = "userfoodlist";
	var userid = this.getUserID();
	var date = new Date();
	var dateTime = this.formatDateTime(date.dateFormat('d/m/Y'), date.dateFormat('H:i'));
	var foodName = $('#newFoodName').val();
	var edibleproportion = $('#newFoodWeight').val()/100;
	var calories = $('#newFoodCalories').val();
	var protein = $('#newFoodProtein').val();
	var fluid = $('#newFoodFluid').val();
	
	// validations
	if(Validator.prototype.isEmpty(foodName)) {
		alert("Please enter a food name.");
		return;
	}else if(Validator.prototype.isEmpty(edibleproportion)) {
		alert("Please enter a quantity weight.");
		return;
	} else if(!Validator.prototype.isPositiveNumber(edibleproportion)) {
		alert("Weight of edible proportion must be a positive number.");
		return;
	} else if(Validator.prototype.isEmpty(calories)) {
		alert("Please enter the amount of calories.");
		return;
	} else if(!Validator.prototype.isPositiveNumber(calories)) {
		alert("Calories must be a positive number.");
		return;
	} else if(Validator.prototype.isEmpty(protein)) {
		alert("Please enter the amount of protein.");
		return;
	} else if(!Validator.prototype.isPositiveNumber(protein)) {
		alert("Protein must be a positive number.");
		return;
	} else if(Validator.prototype.isEmpty(fluid)) {
		alert("Please enter the amount of fluid.");
		return;
	} else if(!Validator.prototype.isPositiveNumber(fluid)) {
		alert("Fluid must be a positive number.");
		return;
	} 
	
	var dataToServer = {
			"table": table,
			"userid": userid,
			"datetime": dateTime,
			"foodname": foodName,
			"edibleproportion": edibleproportion,
			"energy_kcal": calories,
			"protein_g": protein,
			"water_g": fluid,
			"fat_g": 0
	};
	ServerDBAdapter.prototype.submit(dataToServer, "save");
}

SubmitController.prototype.submitMeal = function() {
	var table = "usermeallist";
	
	var userid = this.getUserID();
	var date = new Date();
	var dateTime = this.formatDateTime(date.dateFormat('d/m/Y'), date.dateFormat('H:i'));
	
	var mealName = $('#mealName').val();
	
	// validations
	if(Validator.prototype.isEmpty(mealName)) {
		alert("Please enter a meal name.");
		return;
	} else if($('.selection-list li').first().length == 0) {
		alert("Please select at least one food for a meal.");
		return;
	}
	
	//var foodList =[];
	//var counter = 0;
	$('.selection-list li').each(function(idx, li) {
		var food  = $(li).data('data');
		//var foodLabel = food['foodname'];
		//foodLabel = foodLabel.replace(/,/g, "COMMA");
		//var quantity = food['quantity'];
		
		var dataToServer = {
				"table": table,
				"userid" : userid,
				"datetime": dateTime,
				"mealname": mealName,
				"foodtable": "userfoodlist",
				"foodcode": food['foodcode'],
				"edibleproportion": food['edibleproportion'],
				"foodname": food['foodname'].replace(/,/g, "COMMA"),
				"quantity":food['quantity'],
				"energy_kcal":food['energy_kcal'],
				"protein_g": food['protein_g'],
				"water_g": food['water_g'],
				"fat_g": food['fat_g']
		};
		
		ServerDBAdapter.prototype.submit(dataToServer, "save");
		
		/*var foodTable = "";
		var foodId = 0;
		var edibleProportion = 0;
		var calories = 0;
		var protein = 0;
		var fluid = 0;
		var fat = 0;
		
		var foodDetailsRequestJSON = {
				"action": "get",
				"table": "foodlist",
				"where": "foodname,=," + foodLabel
		};
		var foodDetails = ServerDBAdapter.prototype.get(foodDetailsRequestJSON)[0];
		if(foodDetails != null) {
			alert("access to food list");
			foodTable = "foodlist";
			
			foodId = foodDetails.foodcode;
			edibleProportion = foodDetails.edibleproportion;
			calories = foodDetails.energy_kcal;
			protein = foodDetails.protein_g;
			fluid = foodDetails.water_g;
			fat = foodDetails.fat_g;
		} else {
			alert("access to user food list");
			var userFoodDetailsRequestJSON = {
					"action": "get",
					"table": "userfoodlist",
					"where": "userid,=," + userid + ",foodname,=," + foodLabel
			};
			var userFoodDetails = ServerDBAdapter.prototype.get(userFoodDetailsRequestJSON)[0];
			foodTable = "userfoodlist";
			foodId = userFoodDetails.id;
			edibleProportion = userFoodDetails.edibleproportion;
			calories = userFoodDetails.energy_kcal;
			protein = userFoodDetails.protein_g;
			fluid = userFoodDetails.water_g;
			fat = userFoodDetails.fat_g;
		}*/
		
		
	});	
}

SubmitController.prototype.submitSymptoms = function() {
	var table = "usersymptommanifest";
	
	var userid = this.getUserID();
	var date = $('#symptomDate').val();
	var time = $('#symptomTime').val();
	
	// validations
	if(!Validator.prototype.isValidDate(date)) {
		alert('Please enter a valid date.');
		return;
	} else if(!Validator.prototype.isInPastDateOfBirth(date)) {
		alert('Date cannot be a future date.');
		return;
	}
	
	var checkedSymptoms = {};
	var counter = 0;
	$("#symptomList li.active").each(function(idx, li) {
    	checkedSymptoms[counter] = $(li).text();
    	counter++;
	});
	$("#symptomListCustom li.active").each(function(idx, li) {
		checkedSymptoms[counter] = $(li).text();
		counter++;
	});
	
	var discomfortScores = $('.discomfortRating :selected').text();
	var ratingComplete = [];
    var selectedScores = discomfortScores.toString().split('');
    for (var i = 0; i < selectedScores.length; i++) {
    	var index = selectedScores.indexOf(selectedScores[i]);
        if((selectedScores[i]) !=1) {
        	ratingComplete.push(selectedScores[i]); 
        }
    }
    
    var symptomComments= $(".comments").map(function() {
    	return $(this).val();
 		}).get();
    var commentsComplete = [];
    var selectedComments = symptomComments.toString().split(',');
    for (var i = 0; i < selectedComments.length; i++) {
    	if(selectedComments[i].length > 1) {
    		 commentsComplete.push(selectedComments[i]);
    	}
     }
	
	for(var index = 0; index < counter; index++) {
		var symptom = checkedSymptoms[index];
		var symptomTable = "";
		var symptomId = "";
		
		var symptomDetailsRequestJSON = {
				"action": "get",
				"table": "symptomlist",
				"where": "symptom,=," + symptom
		};
		var symptomDetails = ServerDBAdapter.prototype.get(symptomDetailsRequestJSON)[0];
		
		if(symptomDetails != null) {
			symptomTable = "symptomlist";
			symptomId = symptomDetails.id;
		} else {
			var userSymptomDetailsRequestJSON = {
					"action": "get",
					"table": "usersymptomlist",
					"where": "userid,=," + userid + ",symptom,=," + symptom
			};
			var userSymptomDetails = ServerDBAdapter.prototype.get(userSymptomDetailsRequestJSON)[0];
			symptomTable = "usersymptomlist";
			symptomId = userSymptomDetails.id;
		}
		
		var rating = ratingComplete[index];
		var comment = commentsComplete[index];
		
		var dateTime = this.formatDateTime(date, time);
		
		var dataToServer = {
				"table": table,
				"userid" : userid,
				"datetime": dateTime,
				"symptomtable": symptomTable,
				"symptomid": symptomId,
				"symptom": symptom,
				"rating": rating,
				"comment": comment
		};
		
		ServerDBAdapter.prototype.submit(dataToServer, "save");
	}
	
	this.successMessage("Symptoms submitted.",2000,"home");
}
	
SubmitController.prototype.submitNewCustomSymptom = function() {
	table = "usersymptomlist";
	userid = this.getUserID();
	var date = $('#symptomDate').val();
	var time = $('#symptomTime').val();
	
	var symptom = $("#newSymptom").val();
	
	// validations
	if(Validator.prototype.isEmpty(symptom)) {
		alert("Please enter a symptom name.");
		return;
	} else if(!Validator.prototype.isValidDate(date)) {
		alert('Please enter a valid date.');
		return;
	} else if(!Validator.prototype.isInPastDateOfBirth(date)) {
		alert('Date cannot be a future date.');
		return;
	} 
	
	var datetime = this.formatDateTime(date, time);
	
	var dataToServer = {
			"table": table,
			"userid" : userid,
			"datetime": datetime,
			"symptom": symptom,
	};
	
	ServerDBAdapter.prototype.submit(dataToServer, "save");
}

SubmitController.prototype.submitWeight = function() {
	var table = "userweightmanifest"; 
	
	var userid = this.getUserID();
	var date = $('#datetime').val();
	var weight = $('#newWeight').val();
	
	// validations
	if(!Validator.prototype.isPositiveNumber(weight)) {
		alert("Please enter a valid weight (positive number).");
		return;
	} else if(!Validator.prototype.isValidDate(date)) {
		alert('Please enter a valid date.');
		return;
	} else if(!Validator.prototype.isInPastDateOfBirth(date)) {
		alert('Date cannot be a future date.');
		return;
	} 
	
	var swollenFeet = false;
	var swollenLegs = false;
	var swollenAbdomen = false;
	
	$("#swellings li.active").each(function(idx, li) {
		if($(li).text() == "I have swollen feet.") {
			swollenFeet = true;
		} else if($(li).text() == "I have swollen legs.") {
			swollenLegs = true;
		} else if($(li).text() == "I have a swollen abdomen.") {
			swollenAbdomen = true;
		}
	});
	
	var datetime = this.formatDateTime(date, null);
	
	var dataToServer = {
		"table": table,
		"userid" : userid,
		"datetime": datetime,
		"weight": weight,
		"swollenfeet": swollenFeet,
		"swollenlegs": swollenLegs,
		"swollenabdomen": swollenAbdomen
	};
	
	ServerDBAdapter.prototype.submit(dataToServer, "save");
	
	this.updateRequirements();
	
	this.successMessage("Weight submitted.",2000,"home");
}

SubmitController.prototype.submitSettings = function() {
	var table = "userrequirementsmanifest";
	
	var userId = this.getUserID();
	var date = new Date();
	var dateTime = this.formatDateTime(date.dateFormat('d/m/Y'), null);
	
	var additionalActivity = $('#activity').val();
	var additionalCalories = Math.round($('#cals').val());
	var additionalProtein = Math.round($('#protein').val());
	var additionalFluid = Math.round($('#fluid').val());
	
	if(isNaN(additionalActivity)) {
		alert("Please enter a valid number for additional actitity level.");
		return;
	} else if(isNaN(additionalCalories)) {
		alert("Please enter a valid number for additional calories.");
		return;
	} else if(isNaN(additionalProtein)) {
		alert("Please enter a valid number for additional protein.");
		return;
	} else if(isNaN(additionalFluid)) {
		alert("Please enter a valid number for additional fluid.");
		return;
	}
	
	var weightRequestJSON = {
			"action": "getLast",
			"table": "userweightmanifest",
			"where": "userid,=," + userId + ",swollenfeet,=,0,swollenlegs,=,0,swollenabdomen,=,0"
	};
	var weight = ServerDBAdapter.prototype.get(weightRequestJSON).weight;
	
	var userInfoRequestJSON = {
			"action": "getUserProfile",
			"table": "users",
			"where": "id,=," + userId
	};
	var userInfoResponseJSON = ServerDBAdapter.prototype.get(userInfoRequestJSON)[0];
	
	var gender = userInfoResponseJSON.gender;
	var dateOfBirth = userInfoResponseJSON.dateofbirth;
	var activityLevel = userInfoResponseJSON.activitylevel;
	var age = this.getAge(dateOfBirth);
	
	var finalActivityLevel = parseFloat(activityLevel) + parseFloat(additionalActivity);
	var requirementsCalculator = new RequirementsCalculator();
	var formulaCalories = Math.round(requirementsCalculator.calcCalories(gender, weight, age));
	var formulaProtein = Math.round(requirementsCalculator.calcProtein(weight, age));
	var formulaFluid = Math.round(requirementsCalculator.calcFluid(weight, age));
	var finalCalories = Math.round(parseFloat(formulaCalories) * finalActivityLevel + parseFloat(additionalCalories));
	var finalProtein = Math.round(parseFloat(formulaProtein) * finalActivityLevel + parseFloat(additionalProtein));
	var finalFluid = Math.round(parseFloat(formulaFluid) * finalActivityLevel + parseFloat(additionalFluid));
	
	var dataToServer = {
		"table": table,
		"userid": userId,
		"datetime": dateTime,
		"gender": gender,
		"weight": weight,
		"activitylevel": activityLevel,
		"formulacalories": formulaCalories,
		"formulaprotein": formulaProtein,
		"formulafluid": formulaFluid,
		"additionalcalories": additionalCalories,
		"additionalprotein": additionalProtein,
		"additionalfluid": additionalFluid,
		"additionalactivitylevel": additionalActivity,
		"finalcalories": finalCalories,
		"finalprotein": finalProtein,
		"finalfluid": finalFluid
	}
	
	ServerDBAdapter.prototype.submit(dataToServer, "save");
	
	this.successMessage("Amendments submitted.", 2000, "home");
}

SubmitController.prototype.successMessage = function(message, timeout, page) {

	var warning = $('<div>',{
		"class":"alert alert-success center",
		"role":"alert",
		"text":message
	});
	$('body').append(warning);
	
	var redirectPage
	switch(page)
	{
		case "home": 	redirectPage = "home.html"; break;
		default:		console.log("default in redirect"); redirectPage = "home.html"; break;
	}
	
	setTimeout(function(){warning.remove(); window.location.href = redirectPage; }, timeout);
}
