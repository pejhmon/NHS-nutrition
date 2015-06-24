/**
 * This file contains all of the relevant functionality for manipulating data received from the database in order
 * to be presented to the end user. 
 * @author Vikram Bakshi
 */

function UserData() {}

//Calculate the difference of two dates in total days
UserData.prototype.diffBetTwoDates = function(d1, d2) //http://stackoverflow.com/a/17730331
{
  var ndays;
  var tv1 = d1.valueOf();  // msec since 1970
  var tv2 = d2.valueOf();

  ndays = (tv2 - tv1) / 1000 / 86400;
  ndays = Math.round(ndays - 0.5);
  return ndays;
}



UserData.prototype.minTwoDigits = function(n) //http://stackoverflow.com/a/8043056
{
    return n > 9 ? "" + n: "0" + n;
}

UserData.prototype.formatDate = function(d)
{
	var curr_date 		= d.getDate();
	var curr_month 		= UserData.prototype.minTwoDigits(d.getMonth()+1); //0 indexed so need to add 1. 
	var curr_year 		= d.getFullYear();
	var formattedDate 	= curr_year + "-" + curr_month + "-" + curr_date;
	
	return formattedDate; 
}

/**
 * This method retrieves an array of JSON from the server which contains all of the raw data from four tables for a specified user between
 * a given time period. The raw data is then stored as a property of the object. 
 * @param dateFrom
 * @param dateTo
 */
UserData.prototype.getRawData = function(dateFrom, dateTo) 
{ 
	this.dateFrom			= SubmitController.prototype.formatDateOnly(dateFrom);
	this.dateTo				= SubmitController.prototype.formatDateOnly(dateTo);
	 
	var req = 
	{
			"action":		"getVisualisationData",
			"userHash": 	Cookies.prototype.getUserHash(), 
			"dateFrom": 	this.dateFrom,
			"dateTo": 		this.dateTo
	}
	var jsonData = ServerDBAdapter.prototype.get(req);
	
	for(var i=0; i < jsonData.length; i++)
	{
		if(jsonData[i]["userfoodmanifest"]) 			{ this.rawuserfoodmanifest 			= jsonData[i]["userfoodmanifest"]; 			}
		if(jsonData[i]["userweightmanifest"]) 			{ this.rawuserweightmanifest 		= jsonData[i]["userweightmanifest"]; 		}
		if(jsonData[i]["usersymptommanifest"]) 			{ this.rawusersymptommanifest 		= jsonData[i]["usersymptommanifest"]; 		}
		if(jsonData[i]["userrequirementsmanifest"]) 	{ this.rawuserrequirementsmanifest 	= jsonData[i]["userrequirementsmanifest"]; 	}
	}
	
	console.log(jsonData);
	
}

UserData.prototype.wrangleFoodManifestData = function()
{  
	if(this.rawuserfoodmanifest && this.dateFrom && this.dateTo)
	{			
		//Splitting the date string by '-' and creating a date object from the resulting array. The month is indexed by zero so 1 needs to be subtracted from that argument.  
		var sDateSplit 		= this.dateFrom.split('-'); 									//Originally would be in the form '2015-1-18'					 					
		var eDateSplit		= this.dateTo.split('-');
		var startDate 		= new Date(sDateSplit[0], sDateSplit[1] - 1, sDateSplit[2]); 	//Changing the date string to a JS date object so calculations can easily be performed. 
		var endDate 		= new Date(eDateSplit[0], eDateSplit[1] - 1, eDateSplit[2]);
		
		//Finding the number of days between the start and end dates. This will be the length of our outer loop below.
		var noDays 			= UserData.prototype.diffBetTwoDates(startDate, endDate);
		
		//An empty array which will eventually have the summation statistics pushed to it. 
		var summationStats 	= new Array();		 

		for(var i = 0; i < noDays + 1; i++)
		{
			//Clone of startDate. Is needed so that manipulations can be performed whilst keeping a copy of the original intact.
			var startDateClone 	= 	new Date(sDateSplit[0], sDateSplit[1] - 1, sDateSplit[2]);
			startDateClone.setDate(startDateClone.getDate() + i); //Add the current value of i to amend the date of the clone.
			
			//Save the clone's year, month and, day properties. 
			var year			= startDateClone.getUTCFullYear();
			var month			= UserData.prototype.minTwoDigits(startDateClone.getUTCMonth()+1); 	//Months are indexed 0-11. Passed to minTwoDigits to ensure a minimum of two digits. 
			var day				= UserData.prototype.minTwoDigits(startDateClone.getUTCDate()); 	//Passed to minTwoDigits to ensure a minimum of two digits.  
			
			//Create a new object and set its date to the clone's. The calories, fluid, protein properties will be a summation of calories, fluid and protein
			//consumed by that user on that particular date. 
			var object 			= new Object();
			object.date			= ""+year+month+day; 
			object.calories		= 0.0;
			object.fluid		= 0.0;
			object.protein		= 0.0;
			object.weight		= 0.0;
			
			//Start a loop over the raw json data stored in the rawuserfoodmanifest property. When object.date is equal 
			//to the date of the of the object being iterated over we need code to be run. 
			for(var j = 0; j < this.rawuserfoodmanifest.length; j++)
			{ 	
				//Start wrangling the data to a form where we can apply an if condition for the code that needs to be run. 
				var dateTime	= this.rawuserfoodmanifest[j]['datetime'].split(' '); //splitting by ' ' splits the date and time into dateTime[0] and dateTime[1] respectively. 
				var date	 	= dateTime[0].split('-'); //splitting dateTime[0] by '-' creates an array where date[0] is the year, date[1] is the monthand date[2] is the day. 
				var dateString	= ""+date[0]+date[1]+date[2]; //concatenate so that we have a single string to form the if condition with.
				
				//If this condition matches we need to add the values to the current values of the object. 
				if (object.date.valueOf() === dateString.valueOf())
				{
					if(!isNaN(this.rawuserfoodmanifest[j]['energy_kcal'])) 	{ object.calories 	+= parseFloat(this.rawuserfoodmanifest[j]['energy_kcal']); 	}
					if(!isNaN(this.rawuserfoodmanifest[j]['protein_g'])) 	{ object.protein 	+= parseFloat(this.rawuserfoodmanifest[j]['protein_g']);  	}
					if(!isNaN(this.rawuserfoodmanifest[j]['water_g'])) 		{ object.fluid 		+= parseFloat(this.rawuserfoodmanifest[j]['water_g']);	 	}
					
				} else {} //do nothing
			}
			
			for(var k = 0; k < this.rawuserweightmanifest.length; k++)
			{ 	
				//Start wrangling the data to a form where we can apply an if condition for the code that needs to be run. 
				var dateTime	= this.rawuserweightmanifest[k]['datetime'].split(' '); //splitting by ' ' splits the date and time into dateTime[0] and dateTime[1] respectively. 
				var date	 	= dateTime[0].split('-'); //splitting dateTime[0] by '-' creates an array where date[0] is the year, date[1] is the monthand date[2] is the day. 
				var dateString	= ""+date[0]+date[1]+date[2]; //concatenate so that we have a single string to form the if condition with.
				
				//If this condition matches we need to add the values to the current values of the object. 
				if (object.date.valueOf() === dateString.valueOf())
				{
					if(!isNaN(this.rawuserweightmanifest[k]['weight'])) 	{ object.weight = this.rawuserweightmanifest[k]['weight']; }
				} else {} //do nothing
			}
			
			summationStats.push(object); 
		}
		return summationStats;
	}
	else
	{
		throw { 
		    name:      	"Unset Property Error",  
		    message:    "The rawuserweightmanifest/dateFrom/dateTo property has not been set for this object. " +
		    			"Please call getRawData on this object (to set it) before using this method.", 
		    toString:   function(){return this.name + ": " + this.message;} 
		}; 
	}
}


UserData.prototype.generateSummaryData = function()
{ 
	var userId = SubmitController.prototype.getUserID(); 
	
	var weightDataRequest = 
	{
			"action": 		"getMostFrequent",
			"table": 		"userweightmanifest",
			"where": 		"userid,=," + userId,
			"colForCount":	"id",
			"groupBy":		"datetime",
			"orderBy":		"datetime",
			"ascOrDesc":	"ASC",
			"limit": 		0 				//Limit of 0 would return all entries as 0. 
	};
	
	//The returned JSON would have already been sorted in ascending order i.e. the oldest record would be first. 
	var userWeightData 			= ServerDBAdapter.prototype.get(weightDataRequest);
	if (userWeightData.length === 0) 
	{ 
		throw { 
		    name:      	"Unset Property Error",  
		    message:    "There is no data received from the server for this user's weight.", 
		    toString:   function(){return this.name + ": " + this.message;} 
		}; 
	}
	
	//Save the initial weight (and date of recording) and last recorded weight and its date of recording for easy access later. 
	var initialWeightDate  		= userWeightData[0]['datetime'].split(' ')[0]; //Split on ' ' and take element [0] to store the date only (discarding the time). 
	var initialWeight	   		= userWeightData[0]['weight'];
	var mostRecentWeightDate 	= userWeightData[userWeightData.length-1]['datetime'].split(' ')[0]; //Split on ' ' and take element [0] to store the date only (discarding the time). 
	var mostRecentWeight	   	= userWeightData[userWeightData.length-1]['weight'];
	
	//Calculating the dates for the summary (1 month, 3 month, and 6 month). Code sourced from: http://stackoverflow.com/a/7937257
	var today 			= new Date();
	var oneMonthAgo 	= new Date(); oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	var threeMonthsAgo 	= new Date(); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
	var sixMonthsAgo 	= new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
	
	//Variables which will store an object if the conditions in the loop below are met.
	var oneMonthEntry = null, threeMonthEntry = null, sixMonthEntry = null; 
	
	//Loops over the userWeightData and stores an object the in above null declared variables if certain conditions are met.
	//The gist of the conditions are that the date must be within a time frame of today (1/3/6 months). If a previous iteration 
	//matched an object which conformed to this condition and the current object being iterated over also conforms then they are 
	//compared against each other and the one with he oldest date is taken as the entry for 1/3/6 months. 
	for(var i = 0; i < userWeightData.length; i++)
	{
		var entryDate = new Date(userWeightData[i]['datetime']); //Convert the stored datetime to a JS object for easier manipulation. 
		if( (entryDate > oneMonthAgo) && (entryDate < today))
		{	
			//if the oneMonthEntry variable it is set to null then store the first iterated entry which matches the above condition as the oneMonthEntry.
			if(!oneMonthEntry)  
			{
				oneMonthEntry = userWeightData[i];
			} 
			//otherwise an entry already exists and replace it only with the newly iterated entry if it matches this condition.
			else if(today - entryDate > today - (new Date(oneMonthEntry['datetime']))) 
			{
				oneMonthEntry = userWeightData[i];
			}
		}
		if( (entryDate > threeMonthsAgo) && (entryDate < oneMonthAgo))
		{			
			//if the threeMonthEntry variable it is set to null then store the first iterated entry which matches the above condition as the threeMonthEntry.
			if(!threeMonthEntry)  
			{
				threeMonthEntry = userWeightData[i];
			} 
			//otherwise an entry already exists and replace it only with the newly iterated entry if it matches this condition.
			else if(oneMonthAgo - entryDate > oneMonthAgo - (new Date(threeMonthEntry['datetime']))) 
			{
				threeMonthEntry = userWeightData[i];
			}
		}		
		if( (entryDate > sixMonthsAgo) && (entryDate < threeMonthsAgo))
		{				
			//if the sixMonthEntry variable it is set to null then store the first iterated entry which matches the above condition as the sixMonthEntry.
			if(!sixMonthEntry)  
			{
				sixMonthEntry = userWeightData[i];
			} 
			//otherwise an entry already exists and replace it only with the newly iterated entry if it matches this condition.
			else if(threeMonthsAgo - entryDate > threeMonthsAgo - (new Date(sixMonthEntry['datetime']))) 
			{
				sixMonthEntry = userWeightData[i];
			}
		}		
	}
	
	var oneMonthPercentageChange	= null, threeMonthPercentageChange 	= null, sixMonthPercentageChange = null;
	var oneMonthDateInterval		= null, threeMonthDateInterval		= null, sixMonthDateInterval	 = null; 
	var oneMonthWeight				= null, threeMonthWeight			= null, sixMonthWeight			 = null, 	newWeight = null; 
	if(oneMonthEntry)
	{
		oneMonthWeight				= parseFloat(oneMonthEntry['weight']);
		newWeight					= parseFloat(mostRecentWeight);
		oneMonthDateInterval		= oneMonthEntry['datetime'].split(' ')[0]+" to "+mostRecentWeightDate;
		oneMonthPercentageChange	= (((newWeight - oneMonthWeight)/(oneMonthWeight))*100).toFixed(2);  
	} else {
		oneMonthDateInterval		= "N/A";
		oneMonthPercentageChange	= "No Entry Matching This Condition Was Found.";
	}
	
	if(threeMonthEntry)
	{
		threeMonthWeight			= parseFloat(threeMonthEntry['weight']);
		newWeight					= parseFloat(mostRecentWeight);
		threeMonthDateInterval		= threeMonthEntry['datetime'].split(' ')[0]+" to "+mostRecentWeightDate;
		threeMonthPercentageChange	= (((newWeight - threeMonthWeight)/(threeMonthWeight))*100).toFixed(2);  
	} else {
		threeMonthDateInterval		= "N/A";
		threeMonthPercentageChange	= "No Entry Matching This Condition Was Found.";
	}
	
	if(sixMonthEntry)
	{
		sixMonthWeight				= parseFloat(sixMonthEntry['weight']);
		newWeight					= parseFloat(mostRecentWeight);
		sixMonthDateInterval		= sixMonthEntry['datetime'].split(' ')[0]+" to "+mostRecentWeightDate;
		sixMonthPercentageChange	= (((newWeight - sixMonthWeight)/(sixMonthWeight))*100).toFixed(2);  
	} else {
		sixMonthDateInterval		= "N/A";
		sixMonthPercentageChange	= "No Entry Matching This Condition Was Found.";
	}
	
	var requirementsDataRequest = 
	{
			"action": 		"getMostFrequent",
			"table": 		"userrequirementsmanifest",
			"where": 		"userid,=," + userId,
			"colForCount":	"id",
			"groupBy":		"datetime",
			"orderBy":		"datetime",
			"ascOrDesc":	"DESC",
			"limit": 		1 				//Limit of 1 returns just the latest entry 
	};
	
	//The returned JSON would be a single object because of the limit of 1. This would be the latest requirements of the user.  
	var userRequirementsData 	= ServerDBAdapter.prototype.get(requirementsDataRequest); 
	if (userRequirementsData.length === 0) 
	{ 
		throw { 
		    name:      	"Unset Property Error",  
		    message:    "There is no data received from the server for this user's requirements.", 
		    toString:   function(){return this.name + ": " + this.message;} 
		}; 
	}
	
	var latestRequirementsDate	= userRequirementsData[0]['datetime'].split(' ')[0]; //Split on ' ' and take element [0] to store the date only (discarding the time).
	
	var symptomsTop10DataRequest = 
	{
			"action": 		"getMostFrequent",
			"table": 		"usersymptommanifest",
			"where": 		"userid,=," + userId,
			"colForCount":	"symptom",
			"groupBy":		"symptom",
			"orderBy":		"count",
			"ascOrDesc":	"DESC",
			"limit": 		10 				//Limit of 10 returns top 10 
	};
	
	var symptomsTop10Data = ServerDBAdapter.prototype.get(symptomsTop10DataRequest);
	
	var summaryData 	=
	{
		"initialWeightDate": 			initialWeightDate,
		"initialWeight":				initialWeight,
		"mostRecentWeightDate": 		mostRecentWeightDate, 
		"mostRecentWeight":				mostRecentWeight,
		
		"oneMonthDateInterval":			oneMonthDateInterval,
		"oneMonthPercentageChange": 	oneMonthPercentageChange,
		"oneMonthWeight":				oneMonthWeight,
		
		"threeMonthDateInterval":		threeMonthDateInterval,
		"threeMonthPercentageChange": 	threeMonthPercentageChange,
		"threeMonthWeight":				threeMonthWeight,
		
		"sixMonthDateInterval":			sixMonthDateInterval,
		"sixMonthPercentageChange": 	sixMonthPercentageChange,
		"sixMonthWeight":				sixMonthWeight,
		
		"userRequirements": 			userRequirementsData,  		//JS object
		"userSymptoms":					symptomsTop10Data			//JS Object
	};
	
	return summaryData; 
}





























