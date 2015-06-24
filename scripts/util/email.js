$(document).ready(function() {
	$('.email').click(function() {
		console.log("email");
		
		
		var userid = SubmitController.prototype.getUserID();
		var customSymptomsRequestJSON = {
				"action": "get",
				"table": "usersymptomlist",
				"where": "userid,=," + userid
		};
		var theTypeIs = Object.keys(customSymptomsRequestJSON)[2];
		console.log(theTypeIs + "John");
		
		var customSymptoms = ServerDBAdapter.prototype.get(customSymptomsRequestJSON);
		for(var index = 0; index < customSymptoms.length; index++) {
			var singleCustomSymptom = customSymptoms[index];

			
			var newSymptomInList = singleCustomSymptom.symptom;
			console.log(newSymptomInList);
			var toAdd = []
			toAdd.push(newSymptomInList);

			
			console.log(customSymptoms);


		}			window.location = 'mailto:' + $(this).data('email') + '?subject=Updated Patient Report&body=eMail sent by Appetite'+toAdd;
	});
});