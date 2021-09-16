export default (function () {

    function openDataSoft_Provider () {}

    openDataSoft_Provider.prototype.selectData = function(data) {
        let selectedData = [];
        for(let i=0; i<data.records.length; i++) {
            if(data.records[i].geometry)
                data.records[i].fields["geometry"] = data.records[i].geometry;
            selectedData.push(data.records[i].fields);
        }
        return selectedData;
    };

    openDataSoft_Provider.prototype.addLimit = function(url) {
        if(url.indexOf("&rows=") > -1)
            return url;
        return url + "&rows=10000";
    };

    openDataSoft_Provider.prototype.getHTMLFormattedMetadata = function(dataset, resourceIndex) {
        dataset = dataset.metas;

        let html = '';

        // html += '<b>Producteur:</b> ' + dataset.publisher + '<br>';
        html += '<b>' + ln["resourceName_" + ln["localization"]] + ':</b> <b style="color: #2196F3;">' + dataset.title + '</b><br>';
        html += '<b>' + ln["resourceDescription_" + ln["localization"]] + ':</b>' + dataset.description + '</b><div style="height: 1px; background: #2196F3; margin: 12px 0;"></div>';

        filters = ["_publisher", "title", "description"];

        let orderedKeys = Object.keys(dataset).sort();

        for(let i in orderedKeys) {
            let key = orderedKeys[i];
            let value = dataset[key];
            if (value !== null && value !== undefined && String(value).trim() !== "" && typeof(value) !== 'object' && $.inArray(key, filters) === -1)
                html += '<b>' + key + ':</b> ' + value + '<br>';
        }

        return html;
    };

    openDataSoft_Provider.prototype.getDatasetUrl = function(providerUrl, datasetId) {
        return providerUrl + '/api/datasets/1.0/' + datasetId;
    };

    openDataSoft_Provider.prototype.getResourceUrl = function(providerUrl, datasetId) {
        return providerUrl + '/api/records/1.0/search?dataset=' + datasetId;
    };

    return openDataSoft_Provider;

})();