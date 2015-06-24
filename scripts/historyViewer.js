$(document).ready(function(){
	
	loadHistoryPage()
	$('#tableSelectorLabel').bind('click',function(){
		switchToTable();
	});
	$('#summarySelectorLabel').bind('click',function(){
		switchToSummary();
	});
	$('#graphSelectorLabel').bind('click',function(){
		switchToGraph();
	});
})

/**
 * generate graph selections
 */
function switchToGraph(){
	
	$('#summary').hide();
	$('#graph').show();
	$('#table').hide();
	$('.panel-heading').show();
	$('#foodComponents').empty();
	$('#foodComponents').append($('<option>',{
		 "id":"calories_dropdown",
		 "text":"calories",
		 "value":"energy_kcal"
	 })).append($('<option>',{
		 "id":"protein_dropdown",
		 "text":"protein",
		 "value":"protein_g"
	 })).append($('<option>',{
		 "id":"fluid_dropdown",
		 "text":"fluid",
		 "value":"water_g"
	 })).append($('<option>',{
		 "id":"weight_dropdown",
		 "text":"weight",
		 "value":"weight"
	 }));
	 $('#foodComponents').unbind('onchange');
	 $('#foodComponents').bind('change',function(){
		 manageGraph($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
	 });
}

/**
 * generate table selections
 */
function switchToTable(){
	$('#summary').hide();
	$('#graph').hide();
	$('#table').show();
	$('.panel-heading').show();
	$('#foodComponents').empty();
	 $('#foodComponents').append($('<option>',{
		 "id":"calories_dropdown",
		 "text":"calories",
		 "value":"energy_kcal"
	 })).append($('<option>',{
		 "id":"protein_dropdown",
		 "text":"protein",
		 "value":"protein_g"
	 })).append($('<option>',{
		 "id":"fluid_dropdown",
		 "text":"fluid",
		 "value":"water_g"
	 })).append($('<option>',{
		 "id":"weight_dropdown",
		 "text":"weight",
		 "value":"weight"
	 })).append($('<option>',{
		 "id":"symptom_dropdown",
		 "text":"symptom",
		 "value":"symptom"
	 }));
	 $('#foodComponents').unbind('onchange');
	 $('#foodComponents').bind('change',function(){
			Table.prototype.manageTable($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
	 });
	
}

function loadHistoryPage(){
	
	//fillEmptyDates();
	switchToGraph();
	$('.date').each(function(index,item){
		var datePicker = $(item);
		if(datePicker.val()==""){
			datePicker.val(new Date().dateFormat('d/m/Y'));
		}
		datePicker.bind('change',function(){
			manageGraph($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
			Table.prototype.manageTable($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
			Summary.prototype.manageSummary($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
		})
	});
	 manageGraph($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
	 Summary.prototype.manageSummary($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
	 Table.prototype.manageTable($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
}
/**
 * generate summary selection
 */
function switchToSummary(){
	$('#summary').show();
	$('#graph').hide();
	$('#table').hide();
	$('.panel-heading').hide();
	 $('#foodComponents').unbind('onchange');
	 Summary.prototype.manageSummary($('#foodComponents').val(), $('#datepickerFrom').val(),$('#datepickerTo').val());
}

function fillEmptyDates() {
	if(document.getElementById("datepickerFrom").value == "") {
		document.getElementById("datepickerFrom").value = new Date().dateFormat('d/m/Y');
	}
	
	if(document.getElementById("datepickerTo").value == "") {
		document.getElementById("datepickerTo").value = new Date().dateFormat('d/m/Y');
	}
}