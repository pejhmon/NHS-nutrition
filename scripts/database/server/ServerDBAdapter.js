/**
 * Created by Vikram Bakshi on 03/12/2014.
 * This .js file holds the methods required for sending/receiving data from the server. An object is passed to a method which is sent to the server through AJAX.
 * A PHP script is then run and it echoes back a response. 
*/

/**
 * This is the constructor for the object. 
 */

function ServerDBAdapter() {}

ServerDBAdapter.prototype.submit = function(dataToServer, action)
{
	console.log("printing the data sent to the submit function");
	dataToServer.action = action; //this is needed for the PHP side. Do Not Delete!
	console.log(dataToServer);
	
	var actionUrl;
	switch(action) 
	{	
		case "register":  	actionUrl = "scripts/database/server/register.php"; 				break;  
		case "email":		actionUrl = "scripts/database/server/contact-form-handler.php";		break;
		default: 			actionUrl = "scripts/database/server/clientToServerController.php"; break; 
	}
	
	var results;
	$.ajax({
	    url: 			actionUrl,
	    type: 			"POST",
	    dataType: 		"text", //what you will receive in response. 
	    contentType: 	"application/json", //what you are sending.
	    data: 			JSON.stringify(dataToServer),
	    timeout: 		5000, //timeout the AJAX after 5000 milliseconds.
	    success: 		function (result){
	        				console.log("success " + result); 

	        				if(result != null) {
					        	results = JSON.parse(result); 
					        } else {
					        	results = null;
					        }
	    				},
	    async: 			false, //we want this call to be synchronous to avoid callback complexity. UI is only non-responsive for maximum of 5 seconds.
	    error: 			function (xhr, ajaxOptions, thrownError) {
				        alert("Your request failed. It may have timed out (taken more than 5 seconds). Please check your internet connection and try again.");
	    	
	    				console.log(xhr.statusText);
				        console.log(xhr.responseText);
				        console.log(xhr.status);
				        console.log(thrownError);
	    				}
	});
	return results;
};

ServerDBAdapter.prototype.get = function(dataToServer)
{
	 
	console.log("ServerDBAdapter.prototype.get() entered.");
	console.log("Showing the data being sent to the server"); 
	console.log(dataToServer); 
	
	var results; 
	$.ajax({
	    url: 			"scripts/database/server/clientToServerController.php",
	    type: 			"POST",
	    dataType: 		"text", //what you will receive in response. 
	    contentType: 	"application/json", //what you are sending.
	    data: 			JSON.stringify(dataToServer),
	    timeout: 		5000, //timeout the AJAX after 5000 milliseconds. 
	    success: 		function (result){
		        			console.log("success" + result);
		        			if(result != null) {
					        	results = JSON.parse(result); 
					        } else {
					        	results = null;
					        }
	    				},
	    async: 			false, //we want this call to be synchronous to avoid callback complexity. UI is only non-responsive for maximum of 5 seconds. 
	    error: 			function (xhr, ajaxOptions, thrownError) {
	    					alert("Your request failed. It may have timed out (taken more than 5 seconds). Please check your internet connection and try again.");
					        console.log(xhr.statusText);
					        console.log(xhr.responseText);
					        console.log(xhr.status);
					        console.log(thrownError);
	    				}
	});
	return results;
};