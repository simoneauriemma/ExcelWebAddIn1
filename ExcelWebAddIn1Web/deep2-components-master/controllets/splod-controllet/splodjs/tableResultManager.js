
var tableResultSelect;
var tableResultLabelSelect;
var tableResultResults;
var orderField;
var toOrder;
var ordered;

var TableResultManager = function () {
	if(TableResultManager.prototype._singletonInstance){
		return TableResultManager.prototype._singletonInstance;
	}
	TableResultManager.prototype._singletonInstance = this;

	tableResultSelect = [];
	tableResultLabelSelect = [];
	tableResultResults = [];
	toOrder = false;
	ordered = false;
};

TableResultManager.prototype.updateTable = function(select, labelSelect, results){
	tableResultSelect = select;
	tableResultLabelSelect =labelSelect;
	tableResultResults = results;
	ordered = false;
	if(toOrder)
		orderTable();

	renderResultTable(select, labelSelect, results);
	//console.log("\n testInTable \n ")

	//document.getElementById('hiddenButton').dispatchEvent(new MouseEvent("click", { bubbles: true, cancellable: true }));
	/*const event = new Event("click")
	button.dispatchEvent(event)
	*/
	//document.getElementById("hiddenButton");
	//console.log(button)
	/*var event = new CustomEvent(
		"tableUpdate",
		{
			detail: {
				message: "Hello World!",
				time: new Date(),
			},
			bubbles: true,
			cancelable: true
		}
	);

	document.dispatchEvent(event)*/
	/*const event = new CustomEvent('tableUpdate', { detail: "TEST" });
	document.addEventListener('tableUpdate', function (e) {
		console.log(e.detail);
	});
	document.dispatchEvent(event);
	*/
	/*$(function () {
		console.log("\n Creo l'evento \n")
		// Trigger the event.
		$(document).trigger('tableChange', {
			detail: 'Display on trigger...'
		});
	});*/
	//insertInExcelFuntion
	//if (labelSelect != null)
		//insertInExcel(labelSelect, results);
	//console.log("\n label split ... " + labelSelect.split(",")
   

	//console.log("results......" + results[0])
	//console.log("select......" + select)

}

/*function insertInExcel(labelSelect, results) {
	var labels = new String(labelSelect)
	var labelsComma = labels.split(",")
	

	//insertTable()
	//console.log("\n splitlabel -> " + labelsComma.length)
	//labelsComma.forEach(function(labelsElements){
	/*Excel.run(function (context) {
		// Crea un oggetto proxy per la variabile del foglio attivo
		var sheet = ctx.workbook.worksheets.getActiveWorksheet();
		// Accoda un comando per scrivere i dati di esempio nel foglio di lavoro
		sheet.getRange("A1:D1").values = labelsComma;

		// Esegue i comandi accodati e restituisce una promessa per indicare il completamento dell'attività
		return ctx.sync();
	}).catch(errorHandler);*/

	/*Office.initialize = function (reason) {
		$(document).ready(function () {
			//loadLabels(labelsComma)
		})
	}*/
//}

//function insertTable() {
	//"use strict";
	// La funzione di inizializzazione deve essere eseguita ogni volta che viene caricata una nuova pagina.

	/*Office.initialize = function (reason) {
		//$(document).ready(function () {
			// Se non si usa Excel 2016, usa la logica di fallback.
			if (!Office.context.requirements.isSetSupported('ExcelApi', '1.1')) {
				loadSampleData()
			} else
				loadSampleData();
		//});
	};

	Office.onReady(() => {
		Excel.run(function (context) {
			console.log('Qui funzioni???? nel table result');
		}).catch(function (error) {
			console.log('error: ' + error);
		});
	});
}


	function loadSampleData() {

		// Esegue un'operazione batch sul modello a oggetti di Excel
		Excel.run(function (ctx) {
			// Crea un oggetto proxy per la variabile del foglio attivo
			var sheet = ctx.workbook.worksheets.getActiveWorksheet();
			// Accoda un comando per scrivere i dati di esempio nel foglio di lavoro
			sheet.getRange("B3:D5").values = values;

			// Esegue i comandi accodati e restituisce una promessa per indicare il completamento dell'attività
			return ctx.sync();
		})
			.catch(errorHandler);
	}*/


/*function loadLabel(labelsComma) {
	
		Excel.run(function (context) {
			var sheet = context.workbook.worksheets.getActiveWorksheet();
			sheet.getRange("A1:D1").values = labelsComma;

			return context.sync()
				.then(function () {
					console.log(`The active worksheet is "${sheet.name}"`);
				});
		}).catch(errorHandlerFunction);
    }*/

TableResultManager.prototype.resetTable = function(){
	tableResultSelect = [];
	tableResultLabelSelect = [];
	tableResultResults = [];
	ordered = false;
	resetResultTable();
	resetFieldsList();
}

function orderTable(){
 	orderField = tableResultSelect[0].split('?')[1];
 	tableResultResults.sort(compareResults);
 	ordered = true;
}

function compareResults(a,b) {
	if (a[orderField].value < b[orderField].value)
		return -1;
	if (a[orderField].value > b[orderField].value)
	    return 1;
	return 0;
}

TableResultManager.prototype.orderAndRenderTable = function(){
	if(!ordered)
		orderTable();
	createTable(tableResultSelect, tableResultResults);
}

/*
TableResultManager.prototype.collapseTable = function(){
	//roba e poi create table 
	if(!ordered){
		orderField = tableResultSelect[0].split('?')[1];
 		tableResultResults.sort(compareResults);
	}
	
	var collapsedResults = [];


	for(var i = 0; i< tableResultResults.length; i++)
		var currentValue = tableResultResults[i][orderField].value;
		var currentObj = {};
		for(field in tableResultResults[i]){
			currentObj[field] = []
		}
		while(tableResultResults[i][orderField].value == currentValue){
			for(){

			}
			i++;
		}
	
	}

}
*/