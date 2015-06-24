<html>

<head>
	<link href="lib/bootstrap/bootstrap.min.css" rel="stylesheet">
	<link href="lib/jquery/jquery-ui.css" rel="stylesheet">
	<link href="css/standardPage.css" rel="stylesheet">
	
	<script src="lib/jquery/jquery-2.1.1.min.js"></script>
   	<script src="lib/jquery/jquery-ui-1.11.2.min.js"></script>
   	<script src="lib/bootstrap/bootstrap.min.js"></script>
   	
	<script src="scripts/cookie.js"></script>
	<script src="scripts/dietitianView.js"></script>
	<script src="scripts/SubmitController.js"></script>
	<script src="scripts/database/server/ServerDBAdapter.js"></script>
</head>

<?php

require_once 'scripts/database/server/init.php';
require_once 'scripts/database/server/Configurations.php';
require_once 'scripts/database/server/DB.php';
require_once 'scripts/database/server/User.php';

$user = new User();

if($user->hasPermission('admin'))
{
	echo '<body>
			<nav class="navbar navbar-default" role="navigation">
    	
 			<div class="col-xs-2 border"><img src="resources/gsstlogo.jpg"  height="50" width="70"></div>
      		<div class="col-xs-8 border navbar-title">APPetite</div>
      		<div class="col-xs-2 visible-xs-block border">
      			<span style="float:right">
      				<button class="btn btn-default navbar-btn" data-toggle="collapse" 
      					data-target="#navbar-collapse" id="toggle-button">
      					<i class="glyphicon glyphicon-cog"></i>
      				</button>
     			</span>
      		</div>
      		<div class="collapse navbar-collapse" id="navbar-collapse">
      			<ul class="nav navbar-nav navbar-right">
        			<li><a href="#" id="log_out" onclick="SubmitController.prototype.submit(this.id)">Log out</a></li>
      			</ul>
    		</div>
   
	</nav>
			<div class="container">
    		<div class="search-field">
      			<div class="input-group input-group-lg">
  					<input type="text" class="form-control"  placeholder="Enter NHS Number" id="nhs_search">
  					<span class="input-group-btn">
    					<button class="btn btn-default" type="button" id="directory_search_button">
    						<span class="glyphicon glyphicon-search"></span>
    					</button>
  					</span>
				</div>
   			<div class="panel panel-default element-margin">
  				<div class="panel-heading">
	  				<div class="row">
	  					<div class="col-xs-6">
	  						<span id ="userDir">User Directory:</span>
	  					</div>
	  				</div>
  				</div>
				<div class="panel-body selection-body">
					<div id="progressbar"></div> 

					<table id="patientTable" style="width:100%; text-align: center;" border="1">

					<tr>

					<th>NHS Number</th>
					<th>Date of Birth</th>
					<th>Gender</th>
					<th>Activity Level</th> 

					</tr>

				</table>
			
				</div>
			</div>	
	</body>';
	
	//Now load the dynamic content
	
	
	
} else 
{
	echo '<p> You do not have permission to view this page. You will be redirected 
			  to the home page in 5 seconds. </p>
		  <script>  window.setTimeout(function(){ window.location.href = "index.html";}, 5000); </script>';
}
?>

<?php 
 


?>
</html>