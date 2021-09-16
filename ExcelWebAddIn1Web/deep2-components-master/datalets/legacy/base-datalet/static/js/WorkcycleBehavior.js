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
var WorkcycleBehavior = {
    /**
     * A reference to Polymer object
     *
     */
    _component: null,

    /**
     * Request data from source(e.g. CKAN by api) using some kind of technology(e.g. Ajax)
     *
     * @method requestData
     */
    requestData: function(){
    },

    /**
     * Select the fields from data(typically json) previously retrieved by ajax request. The selection could be done by jsonPath but
     * it depends on the representation data format(CKAN apies return a json representation of the dataset).
     *
     * @method selectData
     */
    selectData: function(){
    },

    /**
     * Filter data previously selected. An example of filterting could be an expression such "fields > 30" or "fields = 'AAA'"
     * If you are using jsonPath to select the datas you can apply an expression directly in the jsonPath query string.
     *
     * @method filterData
     */
    filterData: function(){
    },

    /**
     * Transform the selected data in order to build the structure that the presentation phase needs.
     *
     * @method transformData
     */
    transformData: function(){
    },

    /**
     * Build the object/s for presentation layer.
     *
     * @method presentData
     */
    presentData: function(){

    },

    /**
     * Build the object/s for presentation layer.
     *
     * @method presentData
     */
    redraw: function(){

    },

    /**
     * This method represents the entire datalet workcycle.
     *
     * @method runWorkcycle
     */
    runWorkcycle: function() {
        // try catch in requestData selectData filterData transformData presentData redraw
        try {
            this.selectData();
            this.filterData();
            this.transformData();

            var that = this;
            this._component.async(function () {
                that.presentData();
                $(that._component).find("base-datalet")[0].removeLoader();
                that.redraw();
            }, 600);
        }
        catch (ex){
            $(this._component).find("base-datalet")[0].removeLoader();
            $($(this._component).find("#ajax_error")[0]).append(' error: runWorkcycle ');
            console.log(ex);
        }
    },

    /**
     * This method save the reference to the polymer object related to the datalet.
     *
     * @method init
     */
    init: function(component){
        this._component = component;

        if (this._component.data == undefined) {
            $(this._component).find("base-datalet")[0].removeRefresh();
            this.requestData();
        } else {
            try {
                this.data = this._component.data;
                this.transformData();

                var that = this;
                $($(this._component).find("#refresh")).click(function () {
                    that._component.data = undefined;
                    that.init(component);
                });
                this._component.async(function () {
                    that.presentData();
                    $(that._component).find("base-datalet")[0].removeLoader();
                    that.redraw();
                }, 600);
            }
            catch (ex){
                $(this._component).find("base-datalet")[0].removeLoader();
                $($(this._component).find("#ajax_error")[0]).append(' error: init ');
                console.log(ex);
            }
        }
    }

};