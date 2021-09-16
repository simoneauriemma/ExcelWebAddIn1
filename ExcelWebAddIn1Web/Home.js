/*(function () {
    "use strict";

    var cellToHighlight;
    var messageBanner;

    // La funzione di inizializzazione deve essere eseguita ogni volta che viene caricata una nuova pagina.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Inizializza il meccanismo di notifica e lo nasconde
            var element = document.querySelector('.MessageBanner');
            messageBanner = new components.MessageBanner(element);
            messageBanner.hideBanner();
            
            // Se non si usa Excel 2016, usa la logica di fallback.
            if (!Office.context.requirements.isSetSupported('ExcelApi', '1.1')) {
               /* $("#template-description").text("In questo esempio viene visualizzato il valore delle celle selezionate nel foglio di calcolo.");
                $('#button-text').text("Visualizza");
                $('#button-desc').text("Visualizza la selezione");

                $('#highlight-button').click(displaySelectedCells);
                return;            }

            /*$("#template-description").text("In questo esempio viene evidenziato il valore massimo delle celle selezionate nel foglio di calcolo.");
            $('#button-text').text("Evidenzia");
            $('#button-desc').text("Evidenzia il numero maggiore.");
                
            

            // Aggiunge un gestore dell'evento Click per il pulsante di evidenziazione.
            $('#highlight-button').click(hightlightHighestValue);
            loadSampleData();
        });
    };
    

    
    function loadSampleData() {
        var values = [
            [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)],
            [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)],
            [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000)]
        ];

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
    }

    function hightlightHighestValue() {
        // Esegue un'operazione batch sul modello a oggetti di Excel
        Excel.run(function (ctx) {
            // Crea un oggetto proxy per l'intervallo selezionato e ne carica le proprietà
            var sourceRange = ctx.workbook.getSelectedRange().load("values, rowCount, columnCount");

            // Esegue il comando accodato e restituisce una promessa per indicare il completamento dell'attività
            return ctx.sync()
                .then(function () {
                    var highestRow = 0;
                    var highestCol = 0;
                    var highestValue = sourceRange.values[0][0];

                    // Trova la cella da evidenziare
                    for (var i = 0; i < sourceRange.rowCount; i++) {
                        for (var j = 0; j < sourceRange.columnCount; j++) {
                            if (!isNaN(sourceRange.values[i][j]) && sourceRange.values[i][j] > highestValue) {
                                highestRow = i;
                                highestCol = j;
                                highestValue = sourceRange.values[i][j];
                            }
                        }
                    }

                    cellToHighlight = sourceRange.getCell(highestRow, highestCol);
                    sourceRange.worksheet.getUsedRange().format.fill.clear();
                    sourceRange.worksheet.getUsedRange().format.font.bold = false;

                    // Evidenzia la cella
                    cellToHighlight.format.fill.color = "orange";
                    cellToHighlight.format.font.bold = true;
                })
                .then(ctx.sync);
        })
        .catch(errorHandler);
    }

    function displaySelectedCells() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    showNotification('Il testo selezionato è:', '"' + result.value + '"');
                } else {
                    showNotification('Errore', result.error.message);
                }
            });
    }

/*
    // Funzione helper per la gestione degli errori
    function errorHandler(error) {
        // Assicurarsi sempre di rilevare tutti gli errori accumulati restituiti dall'esecuzione di Excel.run
        showNotification("Errore", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // Funzione helper per la visualizzazione delle notifiche
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();*/
