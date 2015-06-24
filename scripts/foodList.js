/**
 * 
 */
var food;
$(document).ready(function(){
	
	// load data
	 food = loadFoodData();
	// search 
			$('#search').autocomplete({
			source:function (request, response) {
            var term = $.ui.autocomplete.escapeRegex(request.term);
            // sort the search result by input key words
                startsWithMatcher = new RegExp("^" + term, "i");
                 startsWith = $.grep(food, function(value) {
                	 var macther = startsWithMatcher.test(value.foodname);
                    return macther;
                });
                 containsMatcher = new RegExp(term, "i")
                , contains = $.grep(food, function (value) {
                    return $.inArray(value, startsWith) < 0 &&
                        containsMatcher.test(value.foodname);
                });

            response(startsWith.concat(contains));
        },
			select:function(event,ui){
				var selection = ui.item;
				displaySelection(selection);
			},
			minLength: 3,
		});
			
	// click events		
		$('#myMeals').click(function(){
			loadCustomMealView()
		});
		
	$('#newFood').click(function(){
			loadNewFoodView();
		});
	
	$('#newMeal').click(function(){
		loadSaveMealView();
	});
	
	$('#frequentFood').click(function(){
		loadFrequentFoodView();
	});
	
	
	$('#searchButton').click(function() {
		$('#search').focus();
	    $('#search').autocomplete('search');
	});
	
	
	
	//TODO evaluate frequent food
});

function compareWithCurrentSelections(selection){
	var present = false;
	var children = $('.selection-list').children('li');
		children.each(function(index,item){
			var obj= $(item);
			var currentSelection = obj.data('data');
			if(currentSelection.foodname === selection.foodname){
				currentSelection.quantity = parseNutritionData(currentSelection.quantity)+parseNutritionData(selection.quantity);
				var accountButton = obj.find('[name=accountButton]');
				accountButton.text(currentSelection.quantity);
				updateNutritionBreakDown();
				present = true;
			}
		});
	return present;
}

function updateNutritionBreakDown(){
	var children = $('.selection-list').children('li');
	var protein =0;
	var calories = 0;
	var fluid = 0;
	children.each(function(index,item){
		var obj = $(item);
		var data = obj.data('data');
		var quantity = data['quantity'];
		protein += quantity*parseNutritionData(data['protein_g']);
		fluid += quantity*parseNutritionData(data['water_g']);
		calories +=quantity*parseNutritionData(data['energy_kcal']);
	});
	
	$('#calories').text(calories);
	$('#protein').text(protein);
	$('#fluid').text(fluid);
}

function loadNewFoodView(){
	// change the title
	$('#modal-info-title').text("New food");
	
	// construct new body
	$('#modal-info-body').empty();
	var form = $('<form>',{
		"class":"modal-form",
	}).appendTo('#modal-info-body');
	
	var nameField = $('<input>',{
		"class":"form-control",
		"type":"text",
		"id":"newFoodName",
		"placeholder":"Food name",
	}).appendTo(form);
	
	var amountField = $('<input>',{
		"class":"form-control",
		"type":"text",
		"id":"newFoodWeight",
		"placeholder":"Weight of edible proportion in g (e.g. 100)"
	}).appendTo(form);
	
	var caloriesField = $('<input>',{
		"class":"form-control",
		"type":"text",
		"id":"newFoodCalories",
		"placeholder":"Calories (kcal)"
	}).appendTo(form);
	
	var proteinField = $('<input>',{
		"class":"form-control",
		"type":"text",
		"id":"newFoodProtein",
		"placeholder":"Protein (g)"
	}).appendTo(form);
	
	var fluidField =$('<input>',{
		"class":"form-control",
		"type":"text",
		"id":"newFoodFluid",
		"placeholder":"Fluid (ml)"
	}).appendTo(form);
	
	// construct new footer
	var doneButton = $('.modal-button');
		doneButton.unbind('click');
		doneButton.attr('id','btn_submit_newFood');
		doneButton.bind('click',function(){
			SubmitController.prototype.submit(this.id);
			food = loadFoodData();
			});
}

function loadFrequentFoodView(){
	
	// amend this function along with DB.php's function to return the 10 most frequent foods
	var data = OnLoad.prototype.frequentFoods();
	
	// change the title of the modal
	$('#modal-info-title').text("Frequent food");
	
	// construct new body of the modal
	$('#modal-info-body').empty();
	var list = $('<ul>',{
		"class":"list-group",
		"role":"menu"
	}).appendTo('#modal-info-body');
	$.each(data,function(index){
		var li =$('<li>',{
			"class":"list-group-item",
			"text":data[index].foodname	
		}).data('data',data[index]).bind('click',function(){
			displaySelection(data[index]);
		});
		li.appendTo(list);
	})
	
	// construct new footer 
	var doneButton = $('.modal-button');
		doneButton.attr('id','btn_frequentFood');
		doneButton.unbind('click');
		
}


function loadCustomMealView(){
	 
	/*var userId = SubmitController.prototype.getUserID();
	var mealsRequestJSON = {
			"action": "get",
			"table": "usermeallist",
			"where": "userid,=," + userId,	
	};
	var dataFromServer = ServerDBAdapter.prototype.get(mealsRequestJSON);
	//Data received from the server is in the form of an array of JSON objects. Each item in the meal is contained as a separate object. 
	//However, items in the same meal all have the same 'mealname' property. This code segment iterates over the data received from the server
	//and pushes unique meals to an array. This unique array is what is displayed to the user. insert code to push only unique elements to array to display.
	var data = new Array(); 
	for(var i = 0; i < dataFromServer.length; i++)
	{
		console.log(data.length);
		//If the length of the array received from the server is not 0, and the length of the array we are pushing unique meals to is zero then push the element. 
		if( (data.length === 0) && (dataFromServer.length != 0)) 				{ data.push(dataFromServer[i]) } 
		//Otherwise loop over the unique array, checking that the current element in the array received from the server does not already exist in it. 
		else
		{
			var isIn = false; 
			for(var j = 0; j <data.length; j++)
			{
				if(dataFromServer[i]['mealname'] === data[j]['mealname']) { isIn = true; }
			}
			if(!isIn) { data.push(dataFromServer[i]) }
		}
	}*/
	var data = OnLoad.prototype.customMeal();
	$('#modal-info-title').text("My meals");
	// construct body
	$('#modal-info-body').empty();
	var list = $('<ul>',{
		"class":"list-group",
		"role":"menu"
	}).appendTo('#modal-info-body');
	$.each(data,function(index){
		var li =$('<li>',{
			"class":"list-group-item",
			"text":	data[index].mealname
		}).data('data',data).bind('click',function(){
			var mealComponents = OnLoad.prototype.mealComponents(data[index].mealname);
			$.each(mealComponents,function(index){
				var component = mealComponents[index];
				var food ={};
				food["foodcode"] = component["foodcode"]
				food["edibleproportion"]= component["edibleproportion"];
				food["energy_kcal"] = component["energy_kcal"];
				food["fat_g"] = component["fat_g"];
				food["protein_g"]= component["protein_g"];
				food["water_g"]= component["water_g"];
				food["foodname"]= component["foodname"];
				food["quantity"]= parseInt(component["quantity"]);
				displaySelection(food);
			});
		});
		li.appendTo(list);
	})	
	//construct new footer 
	$('#modal-info-footer').empty();
	var doneButton = $('<button>',{
		"type":"button",
		"class":"btn btn-success",
		"data-dismiss":"modal",
		"text":"Done",
		"id":"button-customMeals"
	}).appendTo('#modal-info-footer');
}

function loadSaveMealView(){
	$('#modal-info-title').text("New meal");
	// construct body
	$('#modal-info-body').empty();
	var form = $('<form>',{
		"class":"modal-form",
	}).appendTo('#modal-info-body');
	
	var nameField = $('<input>',{
		"class":"form-control",
		"type":"text",
		"id":"mealName",
		"placeholder":"Meal name",
	}).appendTo(form);
	// construct new footer
	$('#modal-info-footer').empty();
	var doneButton = $('<button>',{
		"type":"button",
		"class":"btn btn-success",
		"data-dismiss":"modal",
		"text":"Save",
		"id":"btn_save_meals"
	}).bind('click',function(){
		SubmitController.prototype.submitMeal(this.id);
	}).appendTo('#modal-info-footer');
}

function displaySelection(selection){
	
	if(!selection.hasOwnProperty('quantity')){
		selection["quantity"] = 1;
	}
	if(!compareWithCurrentSelections(selection)){
			
		var li = new createBasicLi(selection);
		var controlPanel = new createControlPanel();
		var deleteButton = new createDeleteButton('li');
		deleteButton.bind('click',updateNutritionBreakDown);
		var reduceButton = new createReduceButton(selection);
		reduceButton.bind('click',updateNutritionBreakDown);
		var accountButton = new createAccountButton(selection);
		var increaseButton = new createIncreaseButton(selection);
		increaseButton.bind('click',updateNutritionBreakDown);
		controlPanel.addItems([reduceButton,accountButton,increaseButton]);
		li.addItemToLeft(deleteButton);
		
		var amount =$('<span>',{
			"text": "(" +parseFloat(selection.edibleproportion)*100 +"g)"
		});
		
		var displayName =$('<span>',{
			//"class":"text-overflow",
			"text":selection.foodname
		});
		li.addItemToLeft([" ",displayName,amount]);
		li.addItemToRight([controlPanel]);
		$('.selection-list').append(li);
		updateNutritionBreakDown();
		
		}
}

function loadFoodData(){
	var dataSetOne = OnLoad.prototype.load('foodList');
	var dataSetTwo = OnLoad.prototype.load('userFoodList');
	var data = dataSetTwo.concat(dataSetOne);
	return data;
}

// render the search result here
$(function(){
	
	/*$.ui.autocomplete.prototype._renderMenu =function(ul,items){
		console.log(items);
	}*/
	
	//$.ui.autocomplete.prototype._renderItemData = function(){}
	$.ui.autocomplete.prototype._renderItem = function(ul, item) {
	return $('<li>').append(item.foodname).appendTo(ul);
	}
	
})
