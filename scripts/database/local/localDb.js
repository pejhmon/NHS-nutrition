/**
 * Created by Vikram Bakshi on 02/12/2014.
 * This .js file creates a database which is stored locally by the user. The database defines the following object stores:
 * 1) userStore - Contains user details - NHS number/hospital number etc. 
 * 2) foodListStore - This contains all of the foods available from the FSA database along with nutrition values. When a user searches for a food they will consult this object store.
 * 3) userFoodListStore - Will contain any custom foods created by the user.
 * 4) symptomListStore - This contains all of the symptoms which are pre-build into the application (provided by the staff at Guys and St Thomas' NHS Trust).
 * 5) userSymptomListStore - Will contain any custom symptoms created by the user.
 * 6) foodManifest - Will contain data entered by the user relating to the foods/fluids they have consumed.
 * 7) symptomManifest - Will contain data entered by the user relating to the symptoms they have suffered.
 * 8) weightManifest - Will contain data entered by the user relating to their weight.
 * 9) requirementsManifest - This will contain the requirements (calories, protein in grams, etc.) of the user. Requirements can change depending on the weight entry and activity level of the user.
 * 10) syncToServer - This Store will log the entries made in any of manifests and will send them to the server so it can accurately reflect any changes.
 *                   After the server updates this Store's entries will be cleared. An internet connection is required for this.
 *
 * Resources used: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB - Mozilla tutorial for IndexedDB
 *                 JavaScript: The Definitive Guide, 6th Edition, (ISBN #978-0596805524). Copyright 2011 by David Flanagan. Code examples - specifically Example 22-15: pp. 708-712
 *                 http://www.smashingmagazine.com/2014/09/02/building-simple-cross-browser-offline-todo-list-indexeddb-websql/ - Tutorial containing good examples of code use with IndexedDB.
 * Comments in source code below are my own. 
 * 
 */



//TODO Finish the localDBGet function so it returns a summation. Refer to paper for pseudo-code. 
//TODO Create and finalise a delete element function. 
//TODO Create and finalise an edit element property. 
//TODO Create and finish a get function.
//TODO Decide on how to create a uniqueID for each entry in the manifests and user tables. //Think it is done. 
//TODO Finalise the add function (can only be done once unique ID is sorted). //Just need to sort unique ID. 
//TODO Finish this TODO list. 




/**
 * Constructor for the LocalDbSingleton which implements the singleton pattern. This is to make sure only one LocalDbSingleton instantiation takes place and any further
 * use of the 'new' keywords results in a reference to the singleton. Implementation based on code from 'JavaScript Patterns' by Stoyan Stefanov 
 * ISBN #978-0596806750 p.145.
 */
function LocalDbSingleton() 
{
	var instance; //cached instance
	
	LocalDbSingleton = function LocalDbSingleton() // rewritten constructor 
	{
		return instance;
	};
	LocalDbSingleton.prototype = this; // carry over the prototype properties
	instance = new LocalDbSingleton(); //the instance
	instance.constructor = LocalDbSingleton; //reset the constructor pointer
	//below are all of the object's properties. The names of object stores are stored in variables to make re-factoring easier later. 
	instance.dbName = 'appetiteLocalStore'; instance.db ='';
	instance.version = 0; //indexedDB version number
	instance.userStore = 'userStore', instance.foodListStore = 'foodListStore'; instance.userFoodListStore = 'userFoodListStore'; instance.symptomListStore = 'symptomListStore'; 
	instance.userSymptomListStore = 'userSymptomListStore'; instance.foodManifestStore = 'foodManifestStore'; instance.symptomManifestStore = 'symptomManifestStore'; 
	instance.weightManifestStore = 'weightManifestStore'; instance.requirementsManifestStore = 'requirementsManifestStore'; instance.syncToServerStore = 'syncToServerStore'; 
	instance.syncToServerArray = []; //for the databaseAdd method.
	return instance;
}



/**
 * This function is the starting point for adding/deleting/editing any entry to the database. It opens a connection to the database
 * and then calls back whatever you passed to it in the arguments. For example if you want to add an array of objects to the database you would write:
 * var db1 = new LocalDbSingleton(); db1.databaseOpen(LocalDbSingleton.prototype.localDbAdd, 'userFoodListStore', arrayToAdd);
 */
LocalDbSingleton.prototype.databaseOpen = function(callback, arg1, arg2, arg3, arg4, callback2)
{ 
	var _this = this; //storing reference to calling object (this) for binding. 
	//console.log('_this 1'); console.log(_this); //for debugging
	var openReq = indexedDB.open(this.dbName);
	openReq.onerror = this.databaseError;
	openReq.onsuccess = function(event)
	{
		var db = event.target.result; 
		_this.db = db;
		//console.log('successfully opened db'); //for debugging
		console.log('before switch');
		switch (callback)
		{
			case LocalDbSingleton.prototype.localDbAdd: callback(arg1,arg2,_this); break; //arguments -> oStore, arrayOfObjects, objectRef.
			case LocalDbSingleton.prototype.localDbGet: callback(arg1, arg2 , arg3 , _this, arg4, callback2); break; //arguments -> oStore, dateFrom, dateTo, objectRef, makeGraph, callback.
			case LocalDbSingleton.prototype.databaseDelete: callback(_this); break;  
			default: console.log('default in switch in database open');
		}//function(oStore, dateFrom, dateTo, objectRef, callback)
	}
};

//////////////////////////////////////This function contains dummy data for testing at the moment. To be implemented in the future. 
LocalDbSingleton.prototype.get = function(oStore, dateFrom, dateTo, objectRef) //code modelled on example given here: http://www.raymondcamden.com/2013/6/6/IndexedDB-and-Date-Example
{
	return [
	    	    {
	    		 	  "timestamp":"20140115", "calories":345, "protein":20, "fluid":100, "weight":80
	    		},
	    		{
	    		 	  "timestamp":"20140116", "calories":500, "protein":30, "fluid":250, "weight":75
	    		},
	    		{
	    		 	  "timestamp":"20140117", "calories":127, "protein":13, "fluid":400, "weight":78
	    		},
	    		{
	    		 	  "timestamp":"20140118", "calories":470, "protein":66, "fluid":480, "weight":72
	    		},
	    		{
	    		 	  "timestamp":"20140125", "calories":500, "protein":35, "fluid":300, "weight":68
	    		}
	    	];
	
};
////////////////////////////////////////////End of testing code block

/**
 * Returns all objects in a object store which are contained within a given date interval.
 * @param oStore   The object store the caller wishes to return results from.
 * @param dateFrom The date from which the caller wishes to receive data from. It should be passed as a DD/MM/YYYY string.
 * @param dateTo   The date to which the caller wishes to receive data from. It should be passed as a DD/MM/YYYY string.
 */
LocalDbSingleton.prototype.localDbGet = function(oStore, dateFrom, dateTo, objectRef, presentedParameter, callback)
{
	var _this = objectRef, db = _this.db; 
	var splitDateFrom = dateFrom.split('/'), splitDateTo = dateTo.split('/'); 
	
	var fromDate = new Date(splitDateFrom[2], splitDateFrom[1]-1, splitDateFrom[0], 0,0,0,0); //format for date object: new Date(year, month (indexed from 0), day, hours, minutes, seconds, milliseconds)
	var toDate = new Date(splitDateTo[2], splitDateTo[1]-1, parseInt(splitDateTo[0])+1, 0,0,0,0); 
	
	var range;
	
	var transaction = db.transaction([oStore], "readonly").objectStore(oStore);
	var index = transaction.index("Date");
	
    if(fromDate != "" && toDate != "") // fromDate<= x<= toDate where x is an object
    {
		range = IDBKeyRange.bound(fromDate, toDate);
	} else if(fromDate == "") // x<= toDate
	{
		range = IDBKeyRange.upperBound(toDate);
	} else //x>= fromDate
	{
		range = IDBKeyRange.lowerBound(fromDate);
	}
	var results = [], count =0;
	index.openCursor(range).onsuccess = function(event) 
	{
		var cursor = event.target.result;
		if(cursor) 
		{
			count++;
			results.push(cursor.value);
			cursor['continue'](); 
		} else
		{
			console.log("Returned "+count+" results");
			console.log(results);  
			callback(presentedParameter, dateFrom, dateTo, results);
		}
	}
};


/**This function places the objects contained in the array argument in the specified object store. It then recursively calls itself to place the same objects in the
 * syncToServer object store. In the case of the recursive call each object is added with the additional property of what store they were initially added to.   
 * @param oStore			This is the object store in the local indexedDB database you would like to add your JS objects to.
 * @param arrayOfObjects	This is an array containing the objects you would like to add to the local database. 
 */
LocalDbSingleton.prototype.localDbAdd = function(oStore, arrayOfObjects, objectRef) 
{
	var _this = objectRef; //storing object reference for binding purposes.
	var db = _this.db; //console.log(db); //for debugging
	  
	var syncToServerArray = []; 
	var objectStore = db.transaction([oStore], "readwrite").objectStore(oStore);
	var dbAdditionRequest;

	if (!(oStore===_this.syncToServerStore))
	{
		for (var i in arrayOfObjects) 
	    {
			dbAdditionRequest = objectStore.add(arrayOfObjects[i]);
			syncToServerArray[i]= arrayOfObjects[i];
			syncToServerArray[i].details = 'getTheUniqueId'+'-'+'ADD'+'-'+oStore; //uniqueID-ADD-Ostore delimitted by'-' stored as a property for each object. 
	    }
		dbAdditionRequest.onerror = function(e) 
		{
		    console.log("Error",e.target.error.name);
		}
		dbAdditionRequest.onsuccess = function(e) 
		{
		    console.log("Added objects to "+oStore);
		    LocalDbSingleton.prototype.localDbAdd(_this.syncToServerStore,syncToServerArray,_this); //recursive call so array of objects gets added to the synToServerStore as well. 
		}
	}
	else 
	{
		//console.log('made to recursive call'); //for debugging
		for (var i in arrayOfObjects) 
	    {
			dbAdditionRequest = objectStore.add(arrayOfObjects[i]); 	
	    }
		console.log('added the recursive call items'); //for debugging
		
		dbAdditionRequest.onerror = function(e) 
		{
		    console.log("Error",e.target.error.name);
		}
		dbAdditionRequest.onsuccess = function(e) 
		{
		    console.log("Added the recursive objects");
		}
	}
};

/**
 * This function is used to search any object store in the database. You provide the key you are searching for, the object store you want to search in and the index
 * you are searching through - all as strings.  
 * and the index you are searching through - all as strings. 
 * @param key		The key you are searching for.
 * @param oStore	The object store you are searching in. 
 * @param index		The index in the object store which you are searching in. 
 * @param callback	The callback function you will run once the asynchronous call is finished e.g. displayResults(results).
 */
LocalDbSingleton.prototype.databaseSearch = function(key, oStore, index, callback)
{
	var db = this.db;
	var results = []; 
    var keywords= key.toLowerCase(); //The search terms should be lower case as search is case sensitive. 
	console.log("Searching For "+keywords);
    
    var objectStore = db.transaction(oStore, "readonly").objectStore(oStore); //open a transaction on the specified objectStore e.g. foodListStore
    var index = objectStore.index(index); //create the index you are searching for. For example if searching the foodListTable, your index could be FoodNamelc.
    var boundKeyRange = IDBKeyRange.bound(key, key+'\uffff', true, true); //Credit: http://stackoverflow.com/a/8961462/52160
    index.openCursor(boundKeyRange).onsuccess = function (event)
    {
        var cursor = event.target.result;
        if (cursor)
        {
            results.push(cursor.value);
            cursor['continue']();   
        } else {
            console.log("Got all results");
            callback(results);
        }
    };
};

/**
 * This function is intended to be a callback to the asynchronous databaseSearch function. It displays the results of the search in a table by 
 * appending HTML to a predefined div. 
 * @param result This is an array containing the results from the databaseSearch method. 
 */
LocalDbSingleton.prototype.displayResults = function(result)
{
    var results = result;
    document.getElementById("tableOfResults").innerHTML = '';
    console.log("in display result");
    var resultsTable='<table class="resultsTable" align="center"> <tr> <th>Food Name</th> <th>Quantity (g/ml)</th>  <th>Calories (kcal)</th> ' +
                    '<th>Protein (g)</th> <th>Water Fluid (ml)</th></tr>'; //column labels for the table
    for (var i=0; i<results.length; i++)
    {
        resultsTable += '<tr> <td>'+results[i].label+'</td> <td>'+results[i].EdibleProportion+'</td> <td>'+results[i]["Energy.kcal"]+'</td> ' +
                        '<td>'+results[i]["Protein.g"]+'</td> <td>'+results[i]["Water.g"]+'</td> </tr>'; //add a table row for each result
        document.getElementById("tableOfResults").innerHTML = resultsTable;

    }
    resultsTable =+'</table>';
};

/**
 * This function initialises the local database by creating the object stores and populating two of them - the foodListStore and the symptomListStore.
 * They are populated with food data from the UK FDA's free database and the symptom list provided by the NHS staff involved with the project respectively. 
 * Indexes are also created on the object stores to make it easier to query the database later.
 * @param callback	Function you wish to call once this asynchronous method completes.  
 */
LocalDbSingleton.prototype.databaseInit = function(callback)
{
	//storing references to the LocalDbSingleton object's properties. 
	var _this = this, dbName = this.dbName, userStore=this.userStore, foodListStore = this.foodListStore, userFoodListStore = this.userFoodListStore, symptomListStore = this.symptomListStore;
	var userSymptomListStore = this.userSymptomListStore, foodManifestStore = this.foodManifestStore, symptomManifestStore = this.symptomManifestStore, weightManifestStore = this.weightManifestStore;
	var requirementsManifestStore = this.requirementsManifestStore, syncToServerStore = this.syncToServerStore;
    this.begin = Date.now(); var version = this.version, db =this.db;   
    
    var request1 = indexedDB.open(dbName);
    var addData = false; //used to decide whether to populate the object stores with the food and symptom data.  
    request1.onerror = _this.databaseError;
    request1.onupgradeneeded = function(event) //This request is to create the object stores. 
    {
        console.log('in request1 onupgradeneeded');
        addData = true;
    	db = event.target.result; _this.db=db;
        db.onerror = _this.databaseError;
        _this.version++;
        if(!db.objectStoreNames.contains(userStore)) //Store 1. Will contain the unique id of the user.  
        {
            console.log('@ Store 1');
        	var userDataStore = db.createObjectStore(userStore, { keyPath: 'ID' });
        }
        if(!db.objectStoreNames.contains(foodListStore)) //Store 2. Will contain the food data provided by the open source FDA UK website. 
        {
            var foodList = db.createObjectStore(foodListStore, { keyPath: 'FoodCode' });
            foodList.createIndex("FoodCode", "FoodCode", { unique: true });
            foodList.createIndex("label", "label", { unique: false });
        }
        if(!db.objectStoreNames.contains(userFoodListStore)) //Store 3. Will contain any custom food created by the user.
        {
            var userFoodList = db.createObjectStore(userFoodListStore, {keyPath: 'EntryNumber', autoIncrement: true }); 
            userFoodList.createIndex('Date', 'Date', { unique: false });
            userFoodList.createIndex('userFoodListId', 'userFoodListId', { unique: true });
        }
        if(!db.objectStoreNames.contains(symptomListStore)) //Store 4. Contains the symptoms given by the staff at Guy's
        {
           var symptomList = db.createObjectStore(symptomListStore, {keyPath: 'id', autoIncrement: true });
           symptomList.createIndex('Symptom', 'Symptom', {unique: true});
        }
        if(!db.objectStoreNames.contains(userSymptomListStore)) //Store 5. Will contain any custom created symptoms by the user.
        {
           var userSymptomList = db.createObjectStore(userSymptomListStore, { keyPath: 'EntryNumber', autoIncrement: true });
           userSymptomList.createIndex('Symptom', 'Symptom', {unique: true});
        }
        if(!db.objectStoreNames.contains(foodManifestStore)) //Store 6
        {
        	var foodManifest = db.createObjectStore(foodManifestStore, { keyPath: 'EntryNumber', autoIncrement: true });
            foodManifest.createIndex("Date", "Date", { unique: false }); //Adding this index so as to allow fast retrieval/addition to the object store by date.
        }
        if(!db.objectStoreNames.contains(symptomManifestStore)) //Store 7
        {
            var symptomManifest = db.createObjectStore(symptomManifestStore, { keyPath: 'EntryNumber', autoIncrement: true });
            symptomManifest.createIndex("Date", "Date", { unique: false }); //Adding this index so as to allow fast retrieval/addition to the object store by date.
        }
        if(!db.objectStoreNames.contains(weightManifestStore)) //Store 8
        {
            var weightManifest = db.createObjectStore(weightManifestStore, { keyPath: 'EntryNumber', autoIncrement: true });
            weightManifest.createIndex("Date", "Date", { unique: false }); //Adding this index so as to allow fast retrieval/addition to the object store by date.
        }
        if(!db.objectStoreNames.contains(requirementsManifestStore)) //Store 9
        {
            var requirementsManifest = db.createObjectStore(requirementsManifestStore, { keyPath: 'EntryNumber', autoIncrement: true });
            requirementsManifest.createIndex("Date", "Date", { unique: false }); //Adding this index so as to allow fast retrieval/addition to the object store by date.
        }
        if(!db.objectStoreNames.contains(syncToServerStore)) //Store 10
        {
        	console.log('@ Store 10');
        	var syncToServer = db.createObjectStore(syncToServerStore, { keyPath: 'EntryNumber', autoIncrement: true });
        } 
    };
    request1.onsuccess = function(event) 
    { 
    	console.log('request one success'); 
    	db = event.target.result; _this.db=db;
    	console.log('addData: '+addData);
    	if (addData)
    	{	
    		var dataTransaction = db.transaction([foodListStore,symptomListStore], "readwrite");
    		var fls = dataTransaction.objectStore(foodListStore); 
	    	var sls = dataTransaction.objectStore(symptomListStore);
	    	
	    	var foodDataObject = new FoodDataSingleton();
	    	console.log("Starting to populate the foodListStore.");
	        for (var i in foodDataObject.foodData) 
	        {
	           foodDataObject.foodData[i].FoodNamelc = foodDataObject.foodData[i]["label"].toLowerCase();
	           fls.add(foodDataObject.foodData[i]);
	        }
	        console.log(foodListStore+" Initialisation Complete!");
	        
	        var symptomListObject = new SymptomListSingleton(); //instantiate the symptomListSingleton to put the symptoms in the store.
	        console.log("Starting to populate the symptomListStore.");
	        for (var i in symptomListObject.symptomList)
	        {
	     	   sls.add(symptomListObject.symptomList[i]);
	        }
	        console.log(symptomListStore+" Initialisation Complete!");
    	}
    	callback(); 
    };
    
    request1.onversionchange = function(event)
    {
        console.log('at request1 oneversioncahnge');
    };
};

/**
 * Function prints error to the console if the database encounters one. 
 * @param event
 */
LocalDbSingleton.prototype.databaseError = function(event)
{
    console.error('An IndexedDB error has occurred', event);
    console.log('Error name: '+event.target.error.name);
};

/**
 * Function is used to delete the indexedDB database from the local user's browser/hard drive. It's use is mainly for testing purposes.  
 */
LocalDbSingleton.prototype.databaseDelete = function(objectRef)
{
	var _this = objectRef||this, dbName = _this.dbName, db = _this.db;
	db.close();  
	var req = indexedDB.deleteDatabase(this.dbName);
    req.onsuccess = function ()
    {
        console.log("The "+dbName+ "database was deleted successfully");
    };
    req.onerror = function ()
    {
        console.log("The "+dbName+ "database was NOT deleted");
    };
    req.onblocked = function ()
    {
        console.log("Couldn't delete database due to the operation being blocked"); //occurs usually if a connection to the DB is still open.
    };
};

////////////////////////////////////////////////////////BELOW CODE FOR TESTING. DELETE ONCE COMPLETEd. 
//var arrayToAdd = [{name: "one"},{name: "two"},{name: "three"},{name: "four"}]; //for testing. Delete after test. 
var testFoodData = 
	[
    {"Date": Date.now(), "Time": "00:05:01", "FoodCode": "16-250", "label": "Abalone, canned in brine, drained", "EdibleProportion": "N", "Water.g": "65.1",
	"Protein.g": "24.8", "Fat.g": "2.0", "Carbohydrate.g": "Tr", "Energy.kcal": "117", "Energy.kJ": "496", "Starch.g": "Tr" }, 
	
	{"Date": Date.now(), "Time": "time now", "FoodCode": "11-485", "label": "All-Bran", "EdibleProportion": "1.00", "Water.g": "3.0", "Protein.g": "13.0", "Fat.g": "4.0",
		"Carbohydrate.g": "48.5", "Energy.kcal": "270", "Energy.kJ": "1144", "Starch.g": "28.6"}
];

var db1 = new LocalDbSingleton();
db1.databaseInit(function()
{
	var begin = db1.begin, end = Date.now();
	var time = end-begin;
    console.log('It took '+time+' milliseconds to populate the database');
});
//db1.databaseOpen(LocalDbSingleton.prototype.localDbAdd, 'userFoodListStore', arrayToAdd);
//db1.databaseOpen(LocalDbSingleton.prototype.localDbGet, 'symptomManifestStore', ["01","12","2014"],["04","12","2014"] );

/////////////////////////////////////////////////// End of testing block