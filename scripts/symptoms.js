$(document).ready(function () {
		
// This function creates the bootstrap style check boxes
// call "setUpCheckbox" on $('.list-group.checked-list-box .list-group-item') 
	
var setUpCheckbox = function() {
	
	 $('.list-group-item').each(function () {
// Settings
var $widget = $(this),
    $checkbox = $('<input type="checkbox" class="hidden"/>'),
    color = ($widget.data('color') ? $widget.data('color') : "primary"),
    style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
    settings = {
        on: {
            icon: 'glyphicon glyphicon-check'
        },
        off: {
            icon: 'glyphicon glyphicon-unchecked'
        }
    };
    
$widget.css('cursor', 'pointer')
$widget.append($checkbox);

// Event Handlers
$widget.on('click', function () {
    $checkbox.prop('checked', !$checkbox.is(':checked'));
    $checkbox.triggerHandler('change');
    updateDisplay();
});
$checkbox.on('change', function () {
    updateDisplay();
});
  
// Actions
function updateDisplay() {
    var isChecked = $checkbox.is(':checked');

    // Set the button's state
    $widget.data('state', (isChecked) ? "on" : "off");

    // Set the button's icon
    $widget.find('.state-icon')
        .removeClass()
        .addClass('state-icon ' + settings[$widget.data('state')].icon);

    // Update the button's color
    if (isChecked) {
        $widget.addClass(style + color + ' active');
    } else {
        $widget.removeClass(style + color + ' active');
    }
}

function init() {
    
    if ($widget.data('checked') == true) {
        $checkbox.prop('checked', !$checkbox.is(':checked'));
    }
    
    updateDisplay();

    // Inject the icon if applicable
    if ($widget.find('.state-icon').length == 0) {
        $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
 };
 
 //sets up checkboxes loaded after user user selects "symptom not on list"
 
 var setUpCheckbox2 = function() {
	
	 $('.loadedCustomSymptoms').each(function () {
    // Settings
    var $widget = $(this),
        $checkbox = $('<input type="checkbox" class="hidden"/>'),
        color = ($widget.data('color') ? $widget.data('color') : "primary"),
        style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
        settings = {
            on: {
                icon: 'glyphicon glyphicon-check'
            },
            off: {
                icon: 'glyphicon glyphicon-unchecked'
            }
        };
        
    $widget.css('cursor', 'pointer')
    $widget.append($checkbox);

    // Event Handlers
    $widget.on('click', function () {
        $checkbox.prop('checked', !$checkbox.is(':checked'));
        $checkbox.triggerHandler('change');
        updateDisplay();
    });
    $checkbox.on('change', function () {
        updateDisplay();
    });
      
    // Actions
    function updateDisplay() {
        var isChecked = $checkbox.is(':checked');

        // Set the button's state
        $widget.data('state', (isChecked) ? "on" : "off");

        // Set the button's icon
        $widget.find('.state-icon')
            .removeClass()
            .addClass('state-icon ' + settings[$widget.data('state')].icon);

        // Update the button's color
        if (isChecked) {
            $widget.addClass(style + color + ' active');
        } else {
            $widget.removeClass(style + color + ' active');
        }
    }

    function init() {
        
        if ($widget.data('checked') == true) {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
        }
        
        updateDisplay();

        // Inject the icon if applicable
        if ($widget.find('.state-icon').length == 0) {
            $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
 };
 
 //sets up checkboxes after user appends a new symptom to list
 
 var setUpCheckbox3 = function() {
 		
	 $('.newCustomSymptom').each(function () {
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden"/>'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });
          
        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        function init() {
            
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            
            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
 };
	     
 // "#saveNewSymptom" is used on the "symptomNotOnList page"
 // it is used when the user enters a custom symptom 
 // which is then appended to the $("#newSymptomList")
 //Rate discomfort 1-5 (low to high)<select class="discomfortRating"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <br>

 var dropContent = '<br> <input type="text" class="form-control comments symptoms"id="symptomComment" placeholder="Optional comment">';

	$("#btn_save_newCustomSymptom").click(function(){	
		var customSymptom = $('#newSymptom').val();
		var newSymptomInList = '<li class="list-group-item newCustomSymptom" style="cursor: pointer;"><span class="state-icon glyphicon glyphicon-unchecked"></span>'+customSymptom+'</li><div class="drop-scoring">'+dropContent+'</div>';
		$("#symptomListCustom").append(newSymptomInList);	  
	     setUpCheckbox3();
	 	$('.newCustomSymptom').click(function(){
			var target = $(this).next(".drop-scoring");	
		$(target).slideDown('slow');
		}); 
	});

	var symptoms = new SymptomListSingleton().symptomList;
	ko.applyBindings(new symptomsListView(symptoms));

	setUpCheckbox();
    
   // $('#get-checked-data').on('click', function(event) {
       // event.preventDefault(); 
	var userid = SubmitController.prototype.getUserID();
	var customSymptomsRequestJSON = {
			"action": "get",
			"table": "usersymptomlist",
			"where": "userid,=," + userid
	};
	
	var customSymptoms = ServerDBAdapter.prototype.get(customSymptomsRequestJSON);
	for(var index = 0; index < customSymptoms.length; index++) {
		var singleCustomSymptom = customSymptoms[index];
		if(singleCustomSymptom.symptom != ""){		
		var newSymptomInList = '<li class="list-group-item loadedCustomSymptoms" style="cursor: pointer;"><span class="state-icon glyphicon glyphicon-unchecked"></span>'+singleCustomSymptom.symptom+'</li><div class="drop-scoring">'+dropContent+'</div>';
		$("#symptomListCustom").append(newSymptomInList);
		setUpCheckbox2();
		$('.loadedCustomSymptoms').click(function(){
			var target = $(this).next(".drop-scoring");	
			$(target).slideDown('slow');
		});
		}
	}	
	$('#revealHiddenCustomSymptoms').click(function() {

		$(".hiddenSymptomContainer").toggle(400);
	});
});

//Enables drop scoring for non custom symptom list

$( window ).load(function() { 	$('li').click(function(){
		var target = $(this).next(".drop-scoring");	
	$(target).slideDown('slow');
	}); 
})

//Method to combine data with DOMs
//if user needs to rate symptoms
/*ko.bindingHandlers.ratingScore ={
		init:function(element,valueAccessor){
			if(valueAccessor()){
			$(element).addClass("drop-scoring");
			for(var i=1;i<6;i++){
				$('<button>',{
					"text":i
				}).appendTo(element);
			}
			}
		},
		update:function(element,valueAccessor){}
};*/

function symptomsListView(symptoms){
		var self = this;
		this.symptoms =symptoms;
		self.ratingSection = ko.computed(function(){
		},this);
}

//For dietician password entry
$(".passwordButton")
	.click(
			function() {
				var username = $("#username").val();
				var password = $("#password").val();
				if (username == 'NHS' && password == '1100') {
					$('.inputClass').css("border",
							"2px solid green");
					$('.inputClass').css("box-shadow",
							"0 0 3px green");
					window.location.href = "settings.html";
					//Navigator.prototype.setting()

				} else {
					$('.inputClass').css("border",
							"2px solid red");
					$('.inputClass').css("box-shadow",
							"0 0 3px red");
					alert("Invalid name and password");
				}
			});