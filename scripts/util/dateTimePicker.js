 $(function() {
	    $( ".date" ).datepicker({ 
	    	changeMonth: true,
	        changeYear: true,
	        showButtonPanel: true,
	       // maxDate: '@maxDate',
	       // minDate: '@minDate'
	    	dateFormat: 'dd/mm/yy',
	    	yearRange: "-100:+0"

	    });
       
	$('.time').datetimepicker({
		  datepicker:false,
		  format:'H:i',
		  step:30
		});
 });