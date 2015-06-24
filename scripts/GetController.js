/**
 * This .js file's purpose is to contain all functionality and code relating to retrieving data from the database. 
 */

function GetController() {};

GetController.prototype.get = function(getter, data) {
	switch(getter) {
		case 'manageGraph': return GetController.prototype.getUserData(data); break;
	}
}

/**
 * @returns user hash which needs to be included when sent to the server
 */
GetController.prototype.getUserHash = function() {
	return Cookies.prototype.getUserHash(); 	
}

/**
 * This function formats dates from DD/MM/YYYY to YYYY-MM-DD with the intention that only the 
 * formatted dates will be sent to the server. 
 */
GetController.prototype.formatDate = function(date)
{
	var dateArray = date.split('/'); 
	return dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0];
	 
}

GetController.prototype.getUserData = function(data)
{
	console.log('in get User data'); 
	
	var dateFromFormatted = GetController.prototype.formatDate(data.dateFrom); 
	var dateToFormatted   = GetController.prototype.formatDate(data.dateTo); 
	
	//fields are all MANDATORY to be sent to the server
	var weightRequestJSON = {
			"action": "getLast",
			"table": "userweightmanifest",
			"where": "userid,=," + userId
	};
	var weight = ServerDBAdapter.prototype.get(weightRequestJSON).weight;
	
	var dataToServer =
	{
		"action": "get", 
		"userHash": this.getUserHash(), //sending hash rather than userID for security purposes
		"dateFrom": dateFromFormatted,
		"dateTo": dateToFormatted
	}
	console.log(dataToServer); 
	
	return ServerDBAdapter.prototype.get(dataToServer);
}


