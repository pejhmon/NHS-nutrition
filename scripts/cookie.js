/**
 * 
 * Created 26th December 2014
 * @author Vikram Bakshi
 */

function Cookies() {} //cookies constructor

/**
 * This method returns the value of a given cookie with the defined @param name. If the cookie does not exist it returns null.
 * Original JavaScript code by Chirp Internet: www.chirp.com.au. Sourced from: http://www.the-art-of-web.com/javascript/getcookie/
 */
Cookies.prototype.getCookie = function(name)
{
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}

/**
 * Returns the user hash stored in the cookie. This is used to determine which user is sending data.
 * A hash is used rather than the user ID for security purpose. The logged in user will have their corresponding hash
 * stored in the users_session table in the server database. 
 */

Cookies.prototype.getUserHash = function() 
{
	return Cookies.prototype.getCookie("appetiteCookieHash");
}



/**
 * Method returns the value of the userID cookie. If it does not exist it returns null. 
 * The userID cookie is useful when developing so we can easily see which user is logged in.
 * However, when dealing with any user request or submitting the hash should always be used. 
 * @returns
 */
Cookies.prototype.getUserID = function() 
{
	return Cookies.prototype.getCookie("appetiteCookieUserID");
}

console.log(document.cookie);
console.log("Current User Logged in is:");
console.log(Cookies.prototype.getCookie("appetiteCookieUserID"));


//COMMENT OUT THIS IF YOU WANT TO GET RID OF THE REDIRECTION WHEN A USER IS NOT LOGGED IN. 
if(!Cookies.prototype.getUserHash()) 
{
	alert('You are not logged in. Redirecting to log in page..');
	console.log("No User ID stored in cookie. The User is not logged in. Redirecting ....");
	window.location.replace("index.html");
}
