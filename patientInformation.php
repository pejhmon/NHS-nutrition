<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1">
    	<link href="lib/jquery/jquery-ui-1.11.2.min.css" rel="stylesheet">
		<link href="lib/bootstrap/bootstrap.min.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="css/graphs.css"/>
		<link rel="stylesheet" type="text/css" href="css/standardPage.css"/>
		<link href="css/timepicker.css" rel="stylesheet"/>
		
		<script src="lib/jquery/jquery-2.1.1.min.js"></script>
		<script src="lib/jquery/jquery-ui-1.11.2.min.js"></script>
    	<script src="lib/bootstrap/bootstrap.min.js"></script>
		<script src="lib/d3/d3.min.js" charset="utf-8"></script>
		
		<script src="scripts/cookie.js"></script>
		<script src="scripts/OnLoad.js"></script>
		<script src="scripts/util/Validator.js"></script>
		<script src="scripts/SubmitController.js"></script>
		<script src="scripts/database/server/ServerDBAdapter.js"></script>
		<script src="scripts/timepicker.js"></script>
    	<script src="scripts/util/dateTimePicker.js"></script>
    	<script src="scripts/util/email.js"></script>
		<script src="scripts/Navigator.js"></script>
		<script src="scripts/historyViewer.js"></script>
		<script src="scripts/getController.js"></script>
		
		<!-- script src="scripts/dataVisualisation/DateParser.js"></script-->
		<script src="scripts/dataVisualisation/UserData.js"></script>
		<script src="scripts/dataVisualisation/Graph.js"></script>
		<script src="scripts/dataVisualisation/Table.js"></script>
		<script src="scripts/dataVisualisation/Summary.js"></script>
		<link href="lib/tidy-table-1.9.3/tidy-table.min.css" rel="stylesheet"></link>
		<script src="lib/tidy-table-1.9.3/tidy-table.min.js"></script>
		
		<script src="scripts/util/html2canvas.js"></script>
		<script src="scripts/util/jquery.plugin.html2canvas.js"></script>
		

		<title>APPetite</title>
		<!-- 
			//TODO what is this JS? Why is it here?
		<script language="JavaScript">
				var frmvalidator  = new Validator("contactform");
				frmvalidator.addValidation("name","req","Please provide your name");
				frmvalidator.addValidation("email","req","Please provide your email");
				frmvalidator.addValidation("email","email",
				  "Please enter a valid email address");
		</script>
		 -->		
	</head>
	
	<body onload="OnLoad.prototype.load('history')">
			<nav class="navbar navbar-default" role="navigation">
    <!-- Brand and toggle get grouped for better mobile display -->
    
 		<div class="col-xs-2 border">
 		<button class="btn btn-default navbar-btn" id="nav-button" onclick="Navigator.prototype.back()" ><i class="glyphicon glyphicon-chevron-left"></i></button>
    	</div>
      <div class="col-xs-8 border navbar-title">History</div>
      <div class="col-xs-2 visible-xs-block border">
      <span style="float:right">
      <button class="btn btn-default navbar-btn" data-toggle="collapse" data-target="#navbar-collapse" id="toggle-button"><i class="glyphicon glyphicon-cog"></i>
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
	   		<div class="row clearfix">
	    		<div class="col-md-12 column">
	    			<div class="btn-group btn-group-justified" id="presentationFormat" style="padding-top:10px;" role="group" aria-label="..." data-toggle="buttons">
						<label id="graphSelectorLabel" class="btn btn-primary active">
							<input type="radio" name="options" id="graphSelector" class="btn btn-default" autocomplete="off" checked>Graph
				  		</label>
						<label id="tableSelectorLabel" class="btn btn-primary" >
							<input type="radio" name="options" id="tableSelector" class="btn btn-default" autocomplete="off">Table
						</label>
				  		<label id="summarySelectorLabel" class="btn btn-primary" >
				  			<input type="radio" name="options" id="summarySelector" class="btn btn-default" autocomplete="off">Summary
				 		</label>
				 		<!-- label id="flagsSelectorLabel" class="btn btn-primary" >
				  			<input type="radio" name="options" id="flagsSelector" class="btn btn-default" autocomplete="off">Flags
				 		</label-->
					</div>
	    			
	    			<div class="panel panel-default space-margin">
	    			<div class="panel-heading"><form style="margin:0 auto;display:inline" id="parameters">Select 
									<select id="foodComponents" name="foodComponents" >
										<option id="calories_dropdown" value="energy_kcal">Calories</option>
										<option id="protein_dropdown" value="protein_g">Protein</option>
										<option id="fluid_dropdown" value="water_g">Fluid</option>
										<option id="weight_dropdown" value="Weight (kg)">Weight</option>
										<!-- option id="symptoms_dropdown" value="Symptoms">Symptoms</option-->
									</select>
								</form></div>
								<div id = "target">
	    				<div class="panel-body history-panel">
	     				<div class="row" id="datepicker_div">
							<div class="col-xs-6">	From: <input type="text" class="form-control date" id="datepickerFrom"  readonly="readonly" style="cursor :default">
							</div> 
								<div class="col-xs-6">To: <input type="text" class="form-control date" id="datepickerTo"  readonly="readonly" style="cursor :default">
							</div>
						</div>
	     				<div class="row space-margin" id="historyVisualisation">
							<svg id="graph"></svg>
							<div id="table">
							<div class="table-responsive row">
							<table class="table table-stripe scroll-table">
							<thead id="table-header"></thead>
							<tbody id="main-body"></tbody>
							</table>
							</div>
							</div>
							<div id="summary"></div>
						</div>
	     			
	     		</div>
			</div>
	     				</div>
					</div>
					
				</div>
			 <div class="space-margin">
		    	<button class="btn btn-lg btn-success btn-block" data-toggle="modal" 
    						data-target="#modal-export">Export</button> 
		    </div>
		    <div class="modal fade" id="modal-export" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
  			<div class="modal-dialog">
    			<div class="modal-content">
      				<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal">
        					<span aria-hidden="true">&times;</span>
        					<span class="sr-only">Close</span>
        				</button>
        				<h4 class="modal-title">Send your nutrition report via eMail</h4><br>
        				<h6 class="modal-title">nutritional report includes information on your weight change, calorie requirements
        				and most frequent symptoms</h6>
      				</div>
      				<!--  <div class="modal-body">
      					<table class="table table-striped">
							<tr>
      							<th></th>
      							<th>Graph</th>
      							<th>Table</th>
    						</tr>
      						<tr>
      							<td>Calories</td>
      							<td><input type="checkbox" ></td>
      							<td><input type="checkbox"></td>
    						</tr>
    						<tr>
      							<td>Protein</td>
      							<td><input type="checkbox"></td>
      							<td><input type="checkbox"></td>
    						</tr>
    						<tr>
      							<td>Weight</td>
      							<td><input type="checkbox"></td>
      							<td><input type="checkbox"></td>
    						</tr>
    						<tr>
      							<td>Fluid</td>
      							<td><input type="checkbox"></td>
      							<td><input type="checkbox"></td>
    						</tr>
    						<tr>
      							<td>Symptoms</td>
      							<td><input type="checkbox"></td>
      							<td><input type="checkbox"></td>
    						</tr>
    					</table>
      				</div>-->
      				<div class="modal-footer">
						  <form method="post" name="contact_form">
							Email Address: <input type="text" id="email_address" name="email"> 
							 <input type="submit" class="btn btn-success" data-dismiss="modal"  value="Send" id="emailButton" onclick="SubmitController.prototype.submit(this.id)">
							
						</form>
<!-- MAILTO 	<form action="mailto:" method="GET">
    <input type="submit" class="btn btn-success" value="Send" id="emailButton" onclick="SubmitController.prototype.submit(this.id)"/>
</form>-->
<!--for mailto function:  data-email="jobarry@tcd.ie" class="email" -->
      				</div>
    			</div>
  			</div>
		</div>
		</div>
		
<form method="POST" enctype="multipart/form-data" action="scripts/database/server/saveimage.php" id="myForm">
    <input type="hidden" name="img_val" id="img_val" value="img_val" />
</form>

  	</body>
</html>
