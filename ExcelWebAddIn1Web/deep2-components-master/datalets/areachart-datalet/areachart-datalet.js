import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class AreachartDatalet extends BaseDatalet
{
    constructor()
    {
        super('areachart-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior, HighChartsBehavior], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        return this.create_node('');
    }

    async render(data)
    {
        //console.log('RENDER - areachart-datalet');

        await this.import_module('../lib/vendors/highcharts/highstock.js');

        let options = await builder.build('area', this, data);

        let suffix = this.getAttribute("suffix");
        let dataLabels = (this.getAttribute("data-labels") == "true");

        options.plotOptions.area = {
            dataLabels: {
                formatter: function() {
                    return this.y + ' ' + suffix;
                },
                enabled: dataLabels
            },
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        };

        if(data.series[0].data.length > 20)
            Highcharts.stockChart(this.shadowRoot.querySelector('#datalet_container'), options);
        else
            Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}

const FrozenAreachartDatalet = Object.freeze(AreachartDatalet);
window.customElements.define('areachart-datalet', FrozenAreachartDatalet);