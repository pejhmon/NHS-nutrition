/**
 * This script is to be run when the user is attempting to do something when they are not logged in but they are required to be. 
 * It simply changes the page to index.html (the login page) after 5 seconds. 
 */

window.setTimeout(function(){   window.location.href = "index.html"; }, 3000); //3,000 milliseconds