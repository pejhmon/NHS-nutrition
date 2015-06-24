function Summary() {}

Summary.prototype.manageSummary = function(presentedParameter, dateFrom, dateTo) {
	var validator = new Validator();
	if(!validator.datesAreValid(dateFrom, dateTo)) {
		alert("Dates are not valid. Either wrong format or to is older than from.");
		return false;
	}
	
	var userId = SubmitController.prototype.getUserID();
	
	var dateFromFormatted = SubmitController.prototype.formatDateOnly(dateFrom);
	var dateToFormatted = SubmitController.prototype.formatDateOnly(dateTo);
	
	
	this.makeSummary(presentedParameter, dateFrom, dateTo, history);
}

Summary.prototype.makeSummary = function(presentedParameter, dateFrom, dateTo, history) {
	
	
	$('#summary').html('');
	
	var userData 					= new UserData(); 
	var summaryData 				= userData.generateSummaryData();
	
	
	var initialWeightDate 				= summaryData['initialWeightDate'];
	var initialWeight 					= summaryData['initialWeight'];
	var mostRecentWeightDate 			= summaryData['mostRecentWeightDate'];
	var mostRecentWeight 				= summaryData['mostRecentWeight'];
	
	
	var oneMonthDateInterval 			= summaryData['oneMonthDateInterval'];
	var oneMonthPercentageChange 		= summaryData['oneMonthPercentageChange'];
	var oneMonthWeight 					= summaryData['oneMonthWeight'];
	
	var threeMonthDateInterval 			= summaryData['threeMonthDateInterval'];
	var threeMonthPercentageChange 		= summaryData['threeMonthPercentageChange'];
	var threeMonthWeight 				= summaryData['threeMonthWeight'];
	
	var sixMonthDateInterval 			= summaryData['sixMonthDateInterval'];
	var sixMonthPercentageChange 		= summaryData['sixMonthPercentageChange'];
	var sixMonthWeight 					= summaryData['sixMonthWeight'];
	
	var calorieRequirement				= summaryData['userRequirements'][0]['finalcalories'];
	var proteinRequirement				= summaryData['userRequirements'][0]['finalprotein'];
	var fluidRequirement				= summaryData['userRequirements'][0]['finalfluid'];
	var additionalCalorieRequirement	= summaryData['userRequirements'][0]['additionalcalories'];
	var additionalProteinRequirement	= summaryData['userRequirements'][0]['additionalfluid'];
	var additionalFluidRequirement		= summaryData['userRequirements'][0]['additionalprotein'];
	
	var symptoms					= summaryData['userSymptoms'];
	
	//$('#table').html("");
	//d3.select('#graph').attr("width", 0).attr("height", 0);
	
	var weightTable = "" +
		"<table>" +
			"<tr>" +
				"<td style='font-weight: bold'>Registration Date:</td>" +
				"<td> "+initialWeightDate+"</td>" +
			"</tr>" +
			"<tr>" +
				"<td style='font-weight: bold'>Registration Weight: </td>" +
				"<td> "+initialWeight+"</td>" +
			"</tr>" +
			"</table>" +
			
			"<br />" +
			
			"<table>" +
			"<tr>" +
				"<td style='font-weight: bold'>Most Recent Recorded Weight Date:</td>" +
				"<td>   "+mostRecentWeightDate+   "</td>" +
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Most Recent Recorded Weight:</td>" +
				"<td>   "+mostRecentWeight+   "</td>" +
			"</tr>" +
			"</table>" +
			
			"<br />" +
			
			"<table>" +
			"<tr>" +
				" <td style='font-weight: bold'>One Month Percentage Weight Change:</td>" +
				"<td> "+oneMonthPercentageChange+"</td>" +
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Date Interval for Comparison:</td>" +
				"<td> "+oneMonthDateInterval+"</td>" +
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Weight Entry for One Month Comparison:</td>" +
				"<td> "+oneMonthWeight+"</td>" +
			"</tr>" +
			"</table>" +
			
			"<br />" +
			
			"<table >" +
			"<tr>" +
				" <td style='font-weight: bold'>Three Month Percentage Weight Change:</td>" +
				"<td> "+threeMonthPercentageChange+"</td>" +
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'> Date Interval for Comparison:</td>" +
				"<td> "+threeMonthDateInterval+"</td>" +
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Weight Entry for Three Month Comparison:</td>" +
				"<td> "+threeMonthWeight+"</td>" +
			"</tr>" +
			"</table>" +
			
			"<br />" +
			
			"<table>" +
			"<tr>" +
				" <td style='font-weight: bold'>Six Month Percentage Weight Change:</td>" +
				"<td> "+sixMonthPercentageChange+"</td>" +
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Date Interval for Comparison:</td>" +
				"<td> "+sixMonthDateInterval+"</td>" +
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Weight Entry for Six Month Comparison:</td>" +
				"<td> "+sixMonthWeight+"</td>" +
			"</tr>" +
		"</table>" +
		"<br />";
	
	
	var requirementsTable = ""+
			"<table >" +
			"<tr>" +
				" <td style='font-weight: bold'>Calorie Requirement:</td>" +
				"<td>   "+calorieRequirement   +"</td>" +
				"<td>   Of Which Additionally Added:    </td>" +
				"<td>   "+additionalCalorieRequirement+"   </td>"+
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Protein Requirement:</td>" +
				"<td>   "+proteinRequirement+"   </td>" +
				"<td>   Of Which Additionally Added:   </td>" +
				"<td style='font-weight: bold'>   "+additionalProteinRequirement+"   </td>"+
			"</tr>" +
			"<tr>" +
				" <td style='font-weight: bold'>Fluid Requirement:</td>" +
				"<td >   "+fluidRequirement+"   </td>" +
				"<td >   Of Which Additionally Added:    </td>" +
				"<td>   "+additionalFluidRequirement+"   </td>"+
			"</tr>" +
		"</table>";
	
	
	
	var symptomsTable = ""+
	"<table > ";
	
	for(var i=0; i<symptoms.length; i++)
	{
		var symptomObject = symptoms[i];
		
		symptomsTable += ""+
			"<tr>" +
				" <td> Symptom  </td>" +
				" <td> "+symptomObject['symptom']+"</td>" +
				" <td> Occurences:  </td>" +
				" <td> "+symptomObject['count']+"</td>" +
			"</tr>";
	}
	
	symptomsTable += "</table>";
	$('#summary').append($('<h4>Weight: </h4>'));
	$('#summary').append($(weightTable));//.css('text-align','center'));
	$('#summary').append($('<h4>Requirements: </h4>'));
	$('#summary').append($(requirementsTable));//.css('text-align','center'));
	$('#summary').append($('<h4>Symptoms: </h4>'));
	$('#summary').append($(symptomsTable));//.css('text-align','center'));
	
	

}
