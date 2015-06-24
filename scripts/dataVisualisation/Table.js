function Table() {}

Table.prototype.manageTable = function(presentedParameter, dateFrom, dateTo) {
	var validator = new Validator();
	if(!validator.datesAreValid(dateFrom, dateTo)) {
		alert("Dates are not valid. Either wrong format or to is older than from.");
		return false;
	}
	
	var userId = SubmitController.prototype.getUserID();
	var dateFromFormatted = SubmitController.prototype.formatDateOnly(dateFrom);
	var dateToFormatted = SubmitController.prototype.formatDateOnly(dateTo);
	var history;
	var symptoms;
	var Tablename;
	var name;
	switch(presentedParameter){
		case "weight":
			tableName = "userweightmanifest";
			type = "weight";
			break;
		case "symptom":
			tableName = "usersymptommanifest";
			type = "symptom";
			break;
	default:
		tableName = "userfoodmanifest";
		type="foodname";
		break;
	
	}
	this.drawHeader(type,presentedParameter);
	
	var requestJSON ={
			"action": "get",
			"table": tableName,
			"where": "userid,=," + userId + ",datetime,>=," + dateFromFormatted + " 00:00:00," + "datetime,<=," + dateToFormatted + " 23:59:59"
	};
	
	history = ServerDBAdapter.prototype.get(requestJSON);	
	this.drawTable(presentedParameter, dateFrom, dateTo, history,type);
}

Table.prototype.drawTable = function(presentedParameter, dateFrom, dateTo, history,type){
	var items = history;
	var itemName = type;
	$('#date-col').empty();
	$('#main-body').empty();
	$.each(history,function(index,data){
		var dateTime = data['datetime'].split(' ');
		var date = dateTime[0];
		var time = dateTime[1];
		var name = data[type];
		var value = data[presentedParameter];
		Table.prototype.drawTableBody(date,time,name,value);
	});
}


Table.prototype.drawHeader = function(name,presentedParameter){
	$('#table-header').empty();
	$('#table-header').append('<tr><th>Date</th>'+'<th>'+"Time"+'</th>'+'<th>'+name+'</th>'+'<th>'+presentedParameter+'</th></tr>');
	
}

Table.prototype.drawTableBody = function(date,time,name,presentedParameter){
	$('#main-body').append('<tr><td>'+date+'</td><td>'+time+'</td><td>'+name+'</td><td>'+presentedParameter+'</td></tr>');
}
