function Navigator() {}

Navigator.prototype.navigate = function(origin) {
	var nextPage = null;
	console.log("signUp");
	switch(origin)
	{		 
		case "btn_signin_to_home": nextPage = 'home.html'; break;
		case "btn_signup_to_details": nextPage = 'signUpDetails.html'; break;
		case "btn_signUpDetails_to_home": nextPage = 'home.html'; break;
		case "btn_home_to_food": nextPage = 'food.html'; break;
		case "btn_home_to_symptoms": nextPage = 'symptoms.html'; break;
		case "btn_home_to_history": nextPage = 'history.html'; break
		case "btn_home_to_weight": nextPage = 'weight.html'; break;
		case "listEl_home_to_settings": nextPage = 'settings.html'; break;
		case "btn_symptoms_to_symptomNotInList": nextPage = 'symptomNotInList.html'; break;
		default: console.log('Hyperlink unknown.');
	}
	
	window.location.href = nextPage;
}
Navigator.prototype.setting = function(){
	
	window.location.href = "settingsPassword.html";
	
}

Navigator.prototype.back = function(){
	console.log("clicked back button");
	window.history.back();
	
}