/*
@license
    The MIT License (MIT)

    Copyright (c) 2015 Dipartimento di Informatica - Universit� di Salerno - Italy

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

/**
 * Developed by :
 * ROUTE-TO-PA Project - grant No 645860. - www.routetopa.eu
 *
*/


var AjaxJsonAlasqlBehavior = {

    properties: {

        /**
         * It contains the json data from async xhr call returned from core-ajax core component
         *
         * @attribute json_results
         * @type object
         * @default 'null'.
         */
        json_results: {
            type: Object,
            value: {}
        }

    },

    /**
     * Make an AJAX call to the dataset URL
     *
     * @method requestData
     */
    requestData: function(){

        var comp = this;

        $.ajax({
            url: this._component.dataUrl,
            dataType: "json",
            success: function(e){
                try{
                    comp.handleResponse(e);
                }
                catch (ex){
                    $(comp._component).find("base-datalet")[0].removeLoader();
                    $($(comp._component).find("#ajax_error")[0]).append(' error: javascript ');
                    console.log(ex);
                }
            },
            error: function(e) {
                $(comp._component).find("base-datalet")[0].removeLoader();
                $($(comp._component).find("#ajax_error")[0]).append(' ' + e.statusText + ': ' + e.status);
                console.log(e);
            }
        });
    },

    /**
     * Called when core-ajax component receive the json data from called url.
     *
     * @method handleResponse
     */
    handleResponse: function(e) {
        this.properties.json_results.value = e;
        this.runWorkcycle();
    },

    /**
     * selectData built a ALASQL query based on the user selected fields then extract data from the JSON response.
     * This method built an objects <name, data> for every user selected field and push it into the data array.
     *
     * @method selectData
     */
    selectData : function() {
        var f = Object.create(providerFactory);
        var provider = f.getProvider(this._component.dataUrl);
        var data = provider.selectData(this.properties.json_results.value);

        var converter = new DataTypeConverter();

        var result = converter.inferJsonDataType(data, ["*"]);
        result = converter.cast(result);
        this.data = result.dataset;
    },

    filterData : function() {
        var selectedFields = JSON.parse(this._component.getAttribute("selectedfields"));
        var filters = JSON.parse(this._component.getAttribute("filters"));
        var aggregators = JSON.parse(this._component.getAttribute("aggregators"));
        var orders = JSON.parse(this._component.getAttribute("orders"));

        fields = [];
        for (var i=0; i < selectedFields.length; i++)
            if (selectedFields[i])
                fields.push(selectedFields[i].value);

        var converter = new DataTypeConverter();
        var data = this.data;
        var result = [];

        if(filters && filters.length) {
            data = alasql_QUERY(data, "*", filters, null, null);
            result = converter.inferJsonDataType(data, ["*"]);
            result = converter.cast(result);
            data = result.dataset;
        }

        if(aggregators && aggregators.length) {
            data = alasql_QUERY(data, null, null, aggregators, orders);
            result = converter.inferJsonDataType(data, ["*"]);
            result = converter.cast(result);
            data = result.dataset;
        }
        else {
            data = alasql_QUERY(data, fields, null, null, orders);
            result = converter.inferJsonDataType(data, ["*"]);
            result = converter.cast(result);
            data = result.dataset;
        }

        this.data = alasql_transformData(data, fields, true);
    }

};