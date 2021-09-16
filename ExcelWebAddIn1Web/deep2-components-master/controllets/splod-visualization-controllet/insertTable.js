
var button = document.getElementById("hiddenButton")

button.addEventListener("click", doQuery)

var results
var arrayLabels = []
var arrayLabelsExcel
var arrayValueExcel = []


function doQuery() {
    let query = getCookie("query")
    console.log("\n" + query)

    axios.get(query)
        .then(function (response) {
            //console.log(response.data.results.bindings[0].Lighthouse_1.value)
            //console.log(response.data.results)
            results = response.data.results.bindings

            arrayLabels = response.data.head.vars
           // console.log("arrayLabels-->"+ arrayLabels)
            Office.onReady(function () {
                // Office is ready.
                //console.log("\n officePronto")
                $(document).ready(function () {

                    /*var arrayLabelsExcel = [
                        [arrayLabels[0], arrayLabels[1]]
                    ];*/

                    if (arrayLabels.length == 1) {
                        let temp = arrayLabels[0]
                        arrayLabelsExcel = temp
                    } else {                       
                            arrayLabelsExcel = [
                                arrayLabels
                        ]
                    }

                    var labelsRange = createRangeLabels()
                    //console.log(labelsRange)

                    arrayValueExcel

                    results.forEach(x => {
                        let rowArray = []

                        for (var [key, value] of Object.entries(x)) {
                            //console.log(key, value.value);

                            rowArray.push(value.value ? value.value:null)
                        }
                        arrayValueExcel.push(rowArray)
                    })

                    var valueRange = createRangeValue()
                    console.log(valueRange)
                    //console.log(arrayValueExcel)
  
                   /* arrayValueExcel = []
                    for result in results:
                        rowArray = []
                    for label in labels:
                        if label in result:
                            rowArray.append(result[label])
                        else
                            rowArray.append(null)
                    arrayValueExcel.append(rowArray)*/

                    // The document is ready.
                    //console.log("\n documentoPronto")

                    Excel.run(function (ctx) {
                        console.log("\n excelRun")

                        /*var values = [
                            [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)],
                            [Math.floor(Math.random() * 1000), null , Math.floor(Math.random() * 1000)],
                            [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)]
                        ];*/
                        //console.log(values)
                        // Crea un oggetto proxy per la variabile del foglio attivo
                        var sheet = ctx.workbook.worksheets.getActiveWorksheet();
                        // Accoda un comando per scrivere i dati di esempio nel foglio di lavoro
                        
                        sheet.getRange(labelsRange).values = arrayLabelsExcel
                        sheet.getRange(valueRange).values = arrayValueExcel

                        arrayValueExcel = []
                        arrayLabelsExcel = []
                       
                        // Esegue i comandi accodati e restituisce una promessa per indicare il completamento dell'attività
                        return ctx.sync();
                    })
                        .catch(errorHandler);
                });
            });
    }).catch(function (error) {
        console.log(error)
    });
}

// Funzione helper per la gestione degli errori
function errorHandler(error) {
    // Assicurarsi sempre di rilevare tutti gli errori accumulati restituiti dall'esecuzione di Excel.run
    //showNotification("Errore", error);
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
    }
}

function createRangeLabels() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let labelsDimension = arrayLabels.length
    let range = "a1:" + alphabet[labelsDimension-1] + "1"
    return range;
}

function createRangeValue() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let labelsDimension = arrayLabels.length
    let valueDimension = arrayValueExcel.length
    let range = "a2:" + alphabet[labelsDimension - 1] + (valueDimension + 1)
    return range;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}