import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';



@Injectable()
export class DemandDashboardUtilService {
    dailyGraph: any;
    dailyGraphCopy: any;
    monthlyGraph: any = [];
    weeklyGraph: any[];
    GreyWindow: any;
    maxValue: number;
    negYline: number;

    constructor() {
    }


    buildGraphData(graphData) {
        if (graphData.Graph.Axis.length !== 0) {
            graphData.Graph.Axis = this.SortandReverse(graphData.Graph.Axis);
            graphData.Graph.Axis.forEach((obj) => {
                obj.AID = graphData.Graph.AVRG_DAILY_USAGE;
                obj.PID = graphData.Graph.PEAK_DAILY_USAGE;
                obj.dateObj = this.formatDate(obj.X);
            });
            this.maxValue = Math.max(Math.max.apply(Math, graphData.Graph.Axis.map(o => o.Y)), graphData.Graph.PEAK_DAILY_USAGE, graphData.Graph.AVRG_DAILY_USAGE);
            this.negYline = this.maxValue / 10;
            const Iobj = this.buildIPLine(graphData);
            graphData.ITEM_PLAN_IDS = graphData.ItemPlans.map(e => e.ITEM_PLAN_ID);
            graphData.ItemPlans = Iobj.iip;
            graphData.keys = Iobj.keys;
            graphData.POCData = this.buildPOCLine(graphData);
            graphData.OriginBlueWindowStart = graphData.GreyWindow ? this.buildWindowLines(graphData.GreyWindow, 'DEMAND_START_DATE', this.negYline) : null;
            graphData.OriginBlueWindowEnd = graphData.GreyWindow ? this.buildWindowLines(graphData.GreyWindow, 'DEMAND_END_DATE', this.negYline) : null;
            graphData.MovinBlueWindowStart = this.buildWindowLines(graphData.BlueWindow, 'DEMAND_START_DATE', -this.negYline);
            graphData.MovinBlueWindowEnd = this.buildWindowLines(graphData.BlueWindow, 'DEMAND_END_DATE', -this.negYline);
            this.dailyGraph = JSON.parse(JSON.stringify(graphData));
            // this.dailyGraphCopy = JSON.parse(JSON.stringify(graphData));
            this.GreyWindow = this.dailyGraph.GreyWindow;
            graphData.Graph.Axis = this.SortandReverse(graphData.Graph.Axis);
            return graphData;
        } else {
            return graphData;
        }
    }


    buildPOCLine(graphData) {
        const POCData = [];
        POCData.push({ POC: graphData.EXPECTED_DELIVERY_DATE, POCY: 0 }, { POC: graphData.EXPECTED_DELIVERY_DATE, POCY: this.maxValue + 1 });
        return POCData;
    }

    buildWindowLines(window, args, point) {
        const OrgiWin = [];
        OrgiWin.push({ Date: window[args], OriY: 0, DispDate: this.formatLabelDate(window[args]) }, { Date: window[args], OriY: point, DispDate: this.formatLabelDate(window[args]) });
        return OrgiWin;
    }

    removeDuplicates(arr) {
        if (arr) {
            return arr.reduce((unique, o) => {
                if (!unique.some(obj => obj.EFFECTIVE_DATE === o.EXPIRE_DATE)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }
    }

    removeArrayDuplicates(arr, key) {
        return arr.reduce((unique, o) => {
            if (!unique.some(obj => obj[key] === o[key])) {
                unique.push(o);
            }
            return unique;
        }, []);
    }

    buildIPLine(graphData) {
        const ip = [];
        let result = [];
        result = graphData.ItemPlans;
        for (let index = 0; index < result.length; index++) {
            ip.push({ EFF_DATE: moment(new Date(result[index].EFFECTIVE_DATE)), EX_DATE: moment(new Date(result[index].EXPIRE_DATE)), Y: 0, ITEM_PLAN_ID: result[index].ITEM_PLAN_ID });
            ip.push({ EFF_DATE: moment(new Date(result[index].EFFECTIVE_DATE)), EX_DATE: moment(new Date(result[index].EXPIRE_DATE)), Y: -this.negYline, ITEM_PLAN_ID: result[index].ITEM_PLAN_ID });
        }
        const s = result.reduce((acc, e, i) => {
            const EFF_DATE = 'EFF_DATE' + i;
            const EX_DATE = 'EX_DATE' + i;
            const IID = 'IID' + i;
            return { ...acc, [EFF_DATE]: moment(new Date(e.EFFECTIVE_DATE)), [EX_DATE]: moment(new Date(e.EXPIRE_DATE)) };
        }, {});
        const iip = [];
        const key = Object.keys(s);
        iip.push(s);
        const stemop = Object.assign({}, s);
        iip.push(stemop);

        for (let index = 0; index < iip.length; index++) {
            if (index === 0) {
                iip[index].Y = index;
            } else {
                iip[index].Y = -this.negYline;
            }

        }
        const obj = { iip: null, keys: null };
        obj.iip = iip;
        obj.keys = key;
        return obj;
    }

    changeGraphData(gData) {
        if (gData.graphType !== 'Daily') {
            gData.graphData.Graph.Axis = this.buildGraphOnChange(this.dailyGraph.Graph.Axis, gData.graphType);
            gData.graphData.POCData = this.buildPOCLine(gData.graphData);
            return gData.graphData;
        } else {
            gData.graphData.Graph.Axis = this.dailyGraph.Graph.Axis;
            gData.graphData.POCData = this.buildPOCLine(gData.graphData);
            return gData.graphData;
        }
    }

    private SortandReverse(arr) {
        arr.sort(function (a, b) {
            a = new Date(a.dateObj);
            b = new Date(b.dateObj);
            return a > b ? -1 : a < b ? 1 : 0;
        });
        return arr;
    }

    private getNofWeek(arr) {
        arr.forEach(e => {
            e.Week = moment(e.dateObj).week();
            e.Month = new Date(e.dateObj).getMonth();
            e.Year = new Date(e.dateObj).getFullYear();
        });
        return arr.reverse();
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return [year, month, day].join('-');
    }
    formatLabelDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return [month, day].join('-');
    }

    buildGraphOnChange(arr, gType) {
        arr = this.SortandReverse(arr);
        arr = this.getNofWeek(arr);
        const res = {};
        let gData = [];
        const fn = (o, year, month, arr) => {
            o[year][month] =
                arr.filter(({ dateObj: d }) => `${year}-${month}` === d.slice(0, 7));
        };

        for (const { dateObj } of arr) {
            const [year, month] = dateObj.match(/\d+/g);
            if (!res[year]) { res[year] = {}; }
            fn(res, year, month, arr);
        }
        if (gType === 'Monthly') {
            gData = this.buildData(res, 'Month');
        } else if (gType === 'Weekly') {
            gData = this.buildData(res, 'Week');
        } else if (gType === 'Daily') {
            gData = this.buildGraphData(this.dailyGraph);
        }
        return gData;
    }


    buildData(res, gType) {
        const resArr = [];
        // tslint:disable-next-line:forin
        for (const key in res) {
            // tslint:disable-next-line:forin
            for (const ey in res[key]) {
                res[key][ey].filter(function (item) {
                    const i = resArr.findIndex(x => x[gType] === item[gType]);
                    if (i <= -1) {
                        resArr.push(item);
                    }
                    return null;
                });
            }
        }
        const resSorbyDateArr = this.SortandReverse(resArr);
        return resSorbyDateArr;
    }

    rectDates(graph) {
        const rect = { DEMAND_START_DATE: null, DEMAND_END_DATE: null };
        rect.DEMAND_START_DATE = this.formatDate(graph.BlueWindow.DEMAND_START_DATE);
        rect.DEMAND_END_DATE = this.formatDate(graph.BlueWindow.DEMAND_END_DATE);
        return rect;
    }


    buildLegendData(row, graph) {
        row.DEMAND_START_DATE = graph.BlueWindow.DEMAND_START_DATE;
        row.DEMAND_END_DATE = graph.BlueWindow.DEMAND_END_DATE;
        row.ADU = graph.Legend.ADU;
        row.AVRG_DAILY_USAGE = graph.Legend.AVRG_DAILY_USAGE;
        row.PEAK_DAILY_USAGE = graph.Legend.PEAK_DAILY_USAGE;
        row.PEAK_DURATION = graph.Legend.PEAK_DURATION;
        row.STDRD_DEVIATION = graph.Legend.STDRD_DEVIATION;
        row.COEFFICIENT_OF_VARIATION = graph.Legend.COEFFICIENT_OF_VARIATION;
        row.USAGE_FREQUENCY = graph.Legend.USAGE_FREQUENCY;

        return row;
    }


    buildRowData(data, fDate, tDate, graphDates) {
        // console.log(data);
        const post = {
            ITEM_ID: data.ITEM_ID,
            ITEM_PLAN_ID: data.ITEM_PLAN_ID,
            TGT_WORK_CENTER_ID: data.TGT_WORK_CENTER_ID,
            FACILITY_ID: data.FACILITY_ID,
            DAILY_USAGE_OVERRIDE: data.DAILY_USAGE_OVERRIDE,
            PERIOD_VOLUME: data.PERIOD_VOLUME,
            ADU: data.ADU,
            AVRG_DAILY_USAGE: data.AVRG_DAILY_USAGE,
            PEAK_DAILY_USAGE: data.PEAK_DAILY_USAGE,
            DURATION_OF_PEAK: data.PEAK_DURATION,
            STDRD_DEVIATION: data.STDRD_DEVIATION,
            COEFFICIENT_OF_VARIATION: data.COEFFICIENT_OF_VARIATION,
            USAGE_FREQUENCY: data.USAGE_FREQUENCY,
            X_START_DATE: this.formatDate(fDate),
            X_END_DATE: this.formatDate(tDate),
            GRAPH_TYPE: 'D',
            BlueGraph: graphDates ? graphDates : null,
            GreyGraph: this.GreyWindow ? this.GreyWindow : null
        };
        // console.log(post)
        return post;
    }

    buildSaveData(data, graphDates) {
        const post = {
            ITEM_ID: data.ITEM_ID,
            ITEM_PLAN_ID: data.ITEM_PLAN_ID,
            SUPPLIER_NAME: data.SUPPLIER_NAME,
            TGT_WORK_CENTER_ID: data.TGT_WORK_CENTER_ID,
            FACILITY_ID: data.FACILITY_ID,
            DAILY_USAGE_OVERRIDE: data.DAILY_USAGE_OVERRIDE,
            PERIOD_VOLUME: data.PERIOD_VOLUME,
            ADU: data.ADU,
            AVRG_DAILY_USAGE: data.AVRG_DAILY_USAGE,
            PEAK_DAILY_USAGE: data.PEAK_DAILY_USAGE,
            DURATION_OF_PEAK: data.PEAK_DURATION,
            STDRD_DEVIATION: data.STDRD_DEVIATION,
            COEFFICIENT_OF_VARIATION: data.COEFFICIENT_OF_VARIATION,
            USAGE_FREQUENCY: data.USAGE_FREQUENCY,
            BlueGraph: graphDates ? graphDates : null
        };
        return post;
    }
}
