/**
 * 
 */
$(document).ready(function()
{
	/*$( "#progressbar" ).progressbar({
	      value: false
	 });*/
		
	//Dynamically loading the users in the directory div after the page is loaded. 
	displayUserInfoTable();
	
	//When clicking search button on dietitian view:
	$('#directory_search_button').on('click',(function (e)
	{
		// Get the NHS number being searched for from the DOM.
		var nhsnum = $('#nhs_search').val();
		
		// TODO Verify it is a 10 character string.
		
		// Run an AJAX request to get the data which will populate the table for this NHS number.
		displayUserInfoTable(nhsnum);
	}));	
});

function displayUserInfoTable(nhsnumber)
{
	console.log("in getUserInfoData");
	var userRequest = {
			"action": "getUsers",
			"table": "users" 
	};
	if (nhsnumber) { userRequest.where = "nhsnumber,=,"+nhsnumber; }
		
	var userResult = ServerDBAdapter.prototype.get(userRequest);
	var numOfUsers = userResult.length;
	
	// Add to the top of the division - there are 'X' registered users, depening on whether the entire userbase is being displayed or a single search. 
	if(!nhsnumber)
	{
		$('#userDir').html("User Directory - There are "+numOfUsers+" registered users");
	}
	else
	{
		$('#userDir').html("Search Results");
	}

	// Replace the current table in the DOM with this newly generated one.
	$( "#patientTable" ).replaceWith('<table id="patientTable" style="width:100%; text-align: center;" border="1">' +
			'<tr>' +
			'<th>NHS Number</th>' +
			'<th>Date of Birth</th>' +
			'<th>Gender</th>' +
			'<th>Activity Level</th>' + 
			'</tr>');
		
	
	for(var i = 0, j = userResult.length; i < j; i++)
	{
		var nhsnumber 		= userResult[i]['nhsnumber'];
		var dob				= userResult[i]['dateofbirth'].split(" ")[0];
		var gender			= userResult[i]['gender'];
		var activityLevel	= userResult[i]['activitylevel'];
		
		
		$('#patientTable').append(
				'<tr>'
				+
					'<td name ="nhsnumber">' + nhsnumber +'</td>'
					+ '<td name ="DOB">' + dob + '</td>'
					+ '<td name="Gender">' + gender + '</td>'
					+ '<td name="Activitylevel">' + activityLevel + '</td>'
					
					+ '</tr>'
		);
	}
	
	$('#patientTable').append('</table>');
}
