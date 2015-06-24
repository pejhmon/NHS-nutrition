function Validator() {}

Validator.prototype.dateSplit = function(date) {
	var dateSplit = date.split('/');
	
	var day = parseInt(dateSplit[0]);
	var month = parseInt(dateSplit[1]);
	var year = parseInt(dateSplit[2]);
	
	return new Array(day, month, year);
}

Validator.prototype.dateFromOlderThanTo = function(from, to) {
	
	var fromSplit = this.dateSplit(from);
	var toSplit = this.dateSplit(to);
	
	if(toSplit[2] < fromSplit[2]) {
		return false;
	} else if (toSplit[2] == fromSplit[2] && toSplit[1] < fromSplit[1]) {
		return false;
	} else if (toSplit[2] == fromSplit[2] && toSplit[1] == fromSplit[1] && toSplit[0] < fromSplit[0]) {
		return false;
	} else {
		return true;
	}
}

Validator.prototype.isValidDate = function(date) {
	if(typeof(date) != 'string' || date.length != 10) {
		return false;
	}

	var dateSplit = this.dateSplit(date);
	
	if(isNaN(dateSplit[0])|| isNaN(dateSplit[1]) || isNaN(dateSplit[2])) {
		return false;
	}
	
	if(dateSplit[2] <= 0
			|| dateSplit[1] < 1
			|| dateSplit[1] > 12
			|| dateSplit[0] < 1
			|| dateSplit[0] > 31) {
		return false
	}
	
	if(dateSplit[1] == 2 && (dateSplit[0] > 29)) {
		return false;
	}
	
	if(dateSplit[0] == 31 && ((dateSplit[1] != 1) || (dateSplit[1] != 3) || (dateSplit[1] != 5) || (dateSplit[1] != 7)
			|| (dateSplit[1] != 8) || (dateSplit[1] != 10) || (dateSplit[1] != 12))) {
		return false;
	}
	
	return true;
}

Validator.prototype.datesAreValid = function(from, to) {
	if(!this.isValidDate(from) || !this.isValidDate(to)) {
		return false;
	}
	
	if(!this.dateFromOlderThanTo(from, to)) {
		return false;
	}
	
	return true;
}

Validator.prototype.isValidUserName = function(userName)
{
	//Following code checks that the username is unique.
	var usernameUniqueCheck = 
	{
			"action": 		"usernameUnique",
			"nhsnumber": 	userName
	}
	var trueOrFalse = ServerDBAdapter.prototype.get(usernameUniqueCheck); //PHP will echo a JSON object back with property 'tOrf' set to true or a blank object if false.  
	if (trueOrFalse['tOrf']) 	{ return true;  }
	else						{ return false; }
}

Validator.prototype.isValidUserNameFormat = function(userName) {
	if(userName.length != 7) {
		return false;
	} else {
		var tokens = userName.split("");
		if(tokens[0] != "D" || tokens[1] != "T" || isNaN(tokens[2]) || isNaN(tokens[3]) || isNaN(tokens[4]) 
			|| isNaN(tokens[5]) || isNaN(tokens[6])) {
			return false;
		} else {
			return true;
		}
	}
}

Validator.prototype.isValidNhsNumber = function(nhsNumber) {
	// validation of NHS number according to:
	// link: http://www.datadictionary.nhs.uk/version2/data_dictionary/data_field_notes/n/nhs_number_de.asp?shownav=0
	
	if(isNaN(nhsNumber)) {
		return false;
	} else if(nhsNumber.length != 10) {
		return false;
	} else {
		var tokens = nhsNumber.split("");
		var sum = 0;
		var factor = 10;
		for(var index = 0; index < 9; index++) {
			sum += tokens[index] * factor;
			factor--;
		}
		
		var remainder = sum % 11;
		var checkDigit = 11 - remainder;
		
		if(checkDigit == 10) {
			return false;
		} else if(checkDigit == 11) {
			checkDigit = 0;
		}
		
		if(checkDigit != tokens[9]) {
			return false;
		} else {
			return true;
		}
	}
}



Validator.prototype.isIdentifyingPassword = function(idPassword)
{
	var idPasswordJSON = 
	{
			"action": 		"confirmIDPassword",
			"idPassword": 	idPassword
	}
	var trueOrFalse = ServerDBAdapter.prototype.get(idPasswordJSON); //PHP will echo a JSON object back with property 'tOrf' set to true or a blank object if false.  
	if (trueOrFalse['tOrf']) 	{ return true;  }
	else						{ return false; }
}


Validator.prototype.isSame = function(password, passwordConfirm) {
	if(password == passwordConfirm) {
		return true;
	} else {
		return false;
	}
}

Validator.prototype.isPositiveNumber = function(input) {
	if(isNaN(input)) {
		return false;
	} else if(input <= 0) {
		return false;
	} else {
		return true;
	}
}

Validator.prototype.isValidActivityLevel = function(activityLevel) {
	if(isNaN(activityLevel)) {
		return false;
	} else if (activityLevel < 1 || activityLevel > 2) {
		return false;
	} else {
		return true;
	}
}

Validator.prototype.isInPastDateOfBirth = function(dateOfBirth) {
	var now = new Date().dateFormat('d/m/Y');
	
	return this.dateFromOlderThanTo(dateOfBirth, now);
}

Validator.prototype.isValidGender = function(gender) {
	if(gender == "Male" || gender == "Female") {
		return true;
	} else {
		return false;
	}
}

Validator.prototype.isEmpty = function(input) {
	if(input == "") {
		return true;
	} else {
		return false;
	}
}
