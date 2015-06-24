jQuery.fn.extend({

	//add more items to a target DOM
	addItems:function(items){
		var target = $(this);
		$.each(items,function(index){
			target.append(items[index]);
		});
	}
});

// constructor of deleteButton target is the delete target
function createDeleteButton(target){
	var deleteButton = $('<button>',{
	"class":"btn btn-danger btn-xs",
	"id":"deleteButton"
	}).bind('click',function(){
		var item = $(this).closest($(target));
		item.remove();
	}).append($('<span>',{
	"class":"glyphicon glyphicon-trash"
	}));
	return deleteButton;
	}

// constructor of control panel
function createControlPanel(){
	var controlPanel = $('<div>',{
		"class":"btn-group btn-group-xs controlPanel",
		"role":"group",
		"aria-label":"...",
	});
		return controlPanel;
	}

// constructor of increaseButton
function createIncreaseButton(data){
	var increaseButton  = $('<button>',{
		"class":"btn btn-default btn",
		"name":"increaseButton",
		"text":"+"
	}).data('data',data).bind('click',function(){
		var accountButton = $(this).siblings('[name=accountButton]');
		var food = $(this).data('data');
		food.quantity = food.quantity +1;
		accountButton.text(data.quantity);
	});
	return increaseButton;
	}

// constructor of reduce button
function createReduceButton(data){	
	var reduceButton =$('<button>',{

		"class":"btn btn-default btn",
		"name":"reduceButton",
		"text":"-"		

	}).data('data',data).bind('click',function(){
		var accountButton = $(this).siblings('[name=accountButton]');
		var food = $(this).data('data');
		food.quantity = food.quantity -1;
		 
		if (food.quantity <1){
			food.quantity = 1;
		}
		
		accountButton.text(data.quantity);
	});
	
	return reduceButton;
	}

// constructor of account button 
function createAccountButton(data){
	
	var accountButton  = $('<button>',{
	"class":"btn btn-default btn",
	"name":"accountButton",
	"disabled":true,
	"text":data.quantity
	});
	return accountButton;
}

// constructor of basic <li> DOM in our project
function createBasicLi(data){
	var li = $('<li>',{
		"class":"list-group-item",
	}).data('data',data).append($('<div>',{
		"class":"row",
	}).append($('<div>',{
		"class":"col-xs-9 left"
	}).css("padding-left","0px")).append($('<div>',{
		"class":"col-xs-3 right"
	}).css("padding-right","0px")));
	
	li.addItemToLeft = function(items){
		var position = $(this).find('.left');
		position.addItems(items);	
	};
	
	li.addItemToRight = function(items){
		var position = $(this).find('.right');
		position.addItems(items);
	}
	return li;
}
function parseNutritionData(nutrition){
	
	return (isNaN(parseInt(nutrition)))? 0:parseInt(nutrition);
	
}
