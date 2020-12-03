
import { Component, Input, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { event as d3Event } from 'd3-selection';
import { drag as d3Drag } from 'd3-drag';
import { select as d3Select } from 'd3-selection';
// import DemandDashboardService from '../demand-dashboard-service';
import * as moment from 'moment';



@Component({
    selector: 'pfep-demand-line-chart',
    templateUrl: './demand-line-chart.component.html',
    styleUrls: ['./demand-line-chart.component.scss']
})
export class DemandLineChartComponent implements OnInit {
    @Input() graphdata: any;
    @Output() gType = new EventEmitter<any>();
    @Output() rectChangeDates = new EventEmitter<any>();
    @Input() graphType;
    @Input() isEditable = false;
    count = 0;
    x: any;
    y: any;
    width: number;
    dataItemPlan: any;
    data: any;
    dataPOC: any;
    height: number;
    xAxisHeight: number;
    margin: { top: number; right: number; bottom: number; left: number; };
    WinStart: any;
    WinEnd: any;
    valueline: any;
    valueline2: any;
    valueline4: any;
    valueline3: any;
    valueline5: any;
    valueline6: any;
    svg: any;
    rectangle: any;
    dragRect: any;
    keys: string[];
    ITEM_PLAN_IDS = [];
    rectWidth: number;
    dragID: any;
    OriginBlueWindowStart: any;
    OriginBlueWindowEnd: any;
    MovinBlueWindowStart: any;
    MovinBlueWindowEnd: any;
    GreyWinStart: any;
    GreyWinEnd: any;
    GreyrectWidth: number;


    constructor(element: ElementRef,
        //  private deamandDashBoardService: DemandDashboardService
    ) {

    }

    buildXaxisDate(arr, key) {
        arr.forEach(element => {
            element[key] = moment(new Date(element[key]), 'MM-DD-YYYY');
        });
        return arr;
    }

    ngOnChanges() {

        this.count++;
        if (this.count > 1) {
            this.updateData();
        }
    }


    getCursorType() {
        if (this.graphType === 'Daily') {
            return 'pointer';
        } else {
            return 'default';
        }
    }

    updateData() {
        const self = this;
        self.dataItemPlan = this.graphdata.ItemPlans;

        self.data = this.buildXaxisDate(this.graphdata.Graph.Axis, 'X');
        self.dataPOC = this.buildXaxisDate(this.graphdata.POCData, 'POC');
        self.MovinBlueWindowStart = this.buildXaxisDate(this.graphdata.MovinBlueWindowStart, 'Date');
        self.MovinBlueWindowEnd = this.buildXaxisDate(this.graphdata.MovinBlueWindowEnd, 'Date');
        // Scale the range of the data again

        // un comment if u want to rescale x axis
        // self.x.domain(d3.extent(self.data, function (d) { return d.X; }));
        self.y.domain([0, Math.max(Math.max.apply(Math, self.data.map(o => o.Y)), this.graphdata.Graph.PEAK_DAILY_USAGE, this.graphdata.Graph.AVRG_DAILY_USAGE)]);


        // Select the section we want to apply our changes to
        self.svg = d3Select('#graph').transition();

        self.svg.select('#dd') // change the MAIN line
            .duration(750)
            .attr('d', self.valueline(self.data));

        self.svg.select('#AID')   // change the AID line
            .duration(750)
            .attr('d', self.valueline2(self.data));

        self.svg.select('#PID')   // change the PID line
            .duration(750)
            .attr('d', self.valueline3(self.data));

        if (self.OriginBlueWindowStart) {

            self.svg.select('#OStartTxt')
                .attr('transform', 'translate(' + (self.x(new Date(self.OriginBlueWindowStart[0]['Date'])) + 10) + ',' + 0 + ')')
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .style('fill', '#121213')
                .style('font-size', '10px')
                .text(self.OriginBlueWindowStart[0].DispDate);


            self.svg.select('#OEndTxt')
                .attr('transform', 'translate(' + (self.x(new Date(self.OriginBlueWindowEnd[0]['Date'])) + 5) + ',' + 0 + ')')
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .style('fill', '#121213')
                .style('font-size', '10px')
                .text(self.OriginBlueWindowEnd[0].DispDate);

            self.svg.selectAll(`rect[id='1drag']`)
                .style('cursor', this.getCursorType());


        }



        self.svg.select('#MStart')   // change the MStart line
            .duration(750)
            .attr('d', self.valueline6(self.MovinBlueWindowStart))
            .attr('transform', 'translate(22,5.5)');
        self.svg.select('#MStartTxt')
            .attr('transform', 'translate(' + (self.x(new Date(self.MovinBlueWindowStart[0]['Date'])) + 10) + ',' + 340 + ')')
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .style('fill', 'red')
            .style('font-size', '10px')
            .text(self.MovinBlueWindowStart[0].DispDate);

        self.svg.select('#MEnd')   // change the MEnd line
            .duration(750)
            .attr('d', self.valueline6(self.MovinBlueWindowEnd))
            .attr('transform', 'translate(22,5.5)');
        self.svg.select('#MEndTxt')
            .attr('transform', 'translate(' + (self.x(new Date(self.MovinBlueWindowEnd[0]['Date'])) + 5) + ',' + 340 + ')')
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .style('fill', 'red')
            .style('font-size', '10px')
            .text(self.MovinBlueWindowEnd[0].DispDate);



        self.svg.select('.x.axis') // change the x axis
            .duration(750)
            .call(d3.axisBottom(self.x).tickValues([]));
        self.svg.select('.y.axis') // change the y axis
            .duration(750)
            .call(d3.axisLeft(self.y));

    }


    getGraphData() {
        const self = this;
        self.ITEM_PLAN_IDS = this.graphdata.ITEM_PLAN_IDS;
        self.dataItemPlan = this.graphdata.ItemPlans;
        self.keys = this.graphdata.keys;
        self.data = this.buildXaxisDate(this.graphdata.Graph.Axis, 'X');
        self.dataPOC = this.buildXaxisDate(this.graphdata.POCData, 'POC');
        self.OriginBlueWindowStart = this.graphdata.OriginBlueWindowStart ? this.buildXaxisDate(this.graphdata.OriginBlueWindowStart, 'Date') : null;
        self.OriginBlueWindowEnd = this.graphdata.OriginBlueWindowStart ? this.buildXaxisDate(this.graphdata.OriginBlueWindowEnd, 'Date') : null;
        self.MovinBlueWindowStart = this.buildXaxisDate(this.graphdata.MovinBlueWindowStart, 'Date');
        self.MovinBlueWindowEnd = this.buildXaxisDate(this.graphdata.MovinBlueWindowEnd, 'Date');

        self.width = 700;
        self.height = 300;
        self.xAxisHeight = 300 + 5;
        self.margin = { top: 10, right: -10, bottom: 30, left: 10 };

        self.x = d3.scaleTime().domain(d3.extent(self.data, d => d.X)).range([0, self.width + 50]);
        self.y = d3.scaleLinear().range([self.height, 0]);


        // Scale the range of the data
        self.x.domain(d3.extent(self.data, function (d) { return d.X; }));
        self.y.domain([0, Math.max(Math.max.apply(Math, self.data.map(o => o.Y)), this.graphdata.Graph.PEAK_DAILY_USAGE, this.graphdata.Graph.AVRG_DAILY_USAGE)]);

        self.valueline = d3.line()
            .x(function (d) { return self.x(d['X']); })
            .y(function (d) { return self.y(d['Y']); })
            .curve(d3.curveMonotoneX);

        self.valueline2 = d3.line()
            .x(function (d) { return self.x(d['X']); })
            .y(function (d) { return self.y(d['AID']); });
        self.valueline3 = d3.line()
            .x(function (d) { return self.x(d['X']); })
            .y(function (d) { return self.y(d['PID']); });
        self.valueline4 = d3.line()
            .x(function (d) { return self.x(d['POC']); })
            .y(function (d) { return self.y(d['POCY']); });
        self.valueline6 = d3.line()
            .x(function (d) { return self.x(d['Date']); })
            .y(function (d) { return self.y(d['OriY']); });



        self.valueline5 = function (field) {
            return d3.line()
                .x(function (d) {
                    return self.x(d[field]);
                })
                .y(function (d) {
                    return self.y(d.Y);
                });
        };

        self.svg = d3Select('#graph')
            .append('svg')
            .attr('width', self.width + 100)
            .attr('height', self.height + 100)
            .append('g')
            .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');


        self.svg.append('path').data([self.data])
            .attr('class', 'path')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', self.valueline(self.data))
            .attr('transform', 'translate(21,5.5)')
            .attr('id', 'dd')
            .attr('class', 'line');

        self.svg.append('path').data([self.data])
            .attr('class', 'path')
            .attr('fill', 'none')
            .attr('stroke', 'lightgreen')
            .attr('stroke-width', 1.5)
            .attr('d', self.valueline2(self.data))
            .attr('transform', 'translate(20,5.5)')
            .attr('class', 'line')
            .attr('id', 'AID');

        self.svg.append('path').data([self.data])
            .attr('class', 'path')
            .attr('fill', 'none')
            .attr('stroke', 'pink')
            .attr('stroke-width', 1.5)
            .attr('d', self.valueline3(self.data))
            .attr('transform', 'translate(20,5.5)')
            .attr('class', 'line')
            .attr('id', 'PID');
        self.svg.append('path').data([self.dataPOC])
            .attr('class', 'path')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', self.valueline4(self.dataPOC))
            .attr('transform', 'translate(20,5.5)')
            .attr('id', 'POC')
            .attr('stroke-dasharray', '8,8')
            .attr('class', 'line');



        for (let i = 0; i < self.keys.length; i++) {
            // let nameIdx = Math.floor(Math.random() * self.keys.length);
            self.svg.append('path').data([self.dataItemPlan])
                .attr('class', 'path')
                .attr('fill', 'none')
                .attr('stroke', 'green')
                .attr('stroke-width', 1.5)
                .attr('d', self.valueline5(self.keys[i], self.dataItemPlan))
                .attr('transform', 'translate(20,5.5)')
                .attr('id', self.keys[i])
                .attr('class', 'line');
            if (self.dataItemPlan[0]['EFF_DATE' + i] !== undefined) {
                self.svg.append('text')
                    .attr('transform', 'translate(' + (self.x(new Date(self.dataItemPlan[0]['EFF_DATE' + i])) + 30) + ',' + 320 + ')')
                    .attr('dy', '.35em')
                    .attr('text-anchor', 'start')
                    .style('fill', 'green')
                    .style('font-size', '10px')
                    .text(self.ITEM_PLAN_IDS[i]);
            }
        }


        self.WinStart = self.x(moment(new Date(this.graphdata.BlueWindow.DEMAND_START_DATE), 'MM-DD-YYYY'));
        self.WinEnd = self.x(moment(new Date(this.graphdata.BlueWindow.DEMAND_END_DATE), 'MM-DD-YYYY'));
        self.rectWidth = self.WinEnd - self.WinStart;
        self.GreyWinStart = self.x(moment(new Date(this.graphdata.GreyWindow.DEMAND_START_DATE), 'MM-DD-YYYY'));
        self.GreyWinEnd = self.x(moment(new Date(this.graphdata.GreyWindow.DEMAND_END_DATE), 'MM-DD-YYYY'));
        self.GreyrectWidth = self.GreyWinEnd - self.GreyWinStart;

        const windowCount = self.OriginBlueWindowStart ? 2 : 1;
        // self.rectangle = d3.range(windowCount).map((obj, index) => ({
        //     x: self.WinStart,
        //     y: -5,
        //     id: index
        // }));
        if (self.OriginBlueWindowStart) {
            self.rectangle = [{ x: self.GreyWinStart, y: -5, id: 0, winType: 'grey' }, { x: self.WinStart, y: -5, id: 1, winType: 'blue' }];
        } else {
            self.rectangle = [{ x: self.WinStart, y: -5, id: 0, winType: 'blue' }];
        }


        self.dragRect = self.svg.selectAll('g').data(self.rectangle).enter()
            .append('g');

        self.dragRect.append('rect')
            .attr('x', function (d) { return d['x']; })
            .attr('y', function (d) { return d['y']; })
            .attr('height', 300)
            .attr('width', function (d) {
                if (d['winType'] === 'grey') {
                    return self.GreyrectWidth;
                } else {
                    return self.rectWidth;
                }
            })
            .attr('id', function (d) { return d['id'] + 'drag'; })
            .style('fill', function (d) {
                if (d['id'] === 0 && self.OriginBlueWindowStart !== null) {
                    // grey
                    return '#c5c5c5';
                } else if (d['id'] === 1 && self.OriginBlueWindowStart !== null) {
                    // blue
                    return '#C0FFFF';
                } else if (d['id'] === 0 || self.OriginBlueWindowStart !== null) {
                    // blue
                    return '#C0FFFF';
                }
            })
            .style('cursor', function (d) {
                if (d['id'] === 0 && self.OriginBlueWindowStart !== null) {
                    // grey
                    return 'default';
                } else if (d['id'] === 1 && self.OriginBlueWindowStart !== null) {
                    // blue
                    return 'pointer';
                } else if (d['id'] === 0 || self.OriginBlueWindowStart !== null) {
                    // blue
                    return 'pointer';
                }
            })
            .style('opacity', '0.6');

        // window start lines
        if (self.OriginBlueWindowStart) {


            self.svg.append('text')
                .attr('transform', 'translate(' + (self.x(new Date(self.OriginBlueWindowStart[0]['Date'])) + 10) + ',' + 0 + ')')
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .attr('id', 'OStartTxt')
                .style('fill', '#121213')
                .style('font-size', '10px')
                .text(self.OriginBlueWindowStart[0].DispDate);

            self.svg.append('text')
                .attr('transform', 'translate(' + (self.x(new Date(self.OriginBlueWindowEnd[0]['Date'])) + 5) + ',' + 0 + ')')
                .attr('dy', '.35em')
                .attr('text-anchor', 'start')
                .attr('id', 'OEndTxt')
                .style('fill', '#121213')
                .style('font-size', '10px')
                .text(self.OriginBlueWindowEnd[0].DispDate);
        }

        self.svg.append('path').data([self.MovinBlueWindowStart])
            .attr('class', 'path')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', self.valueline6(self.MovinBlueWindowStart))
            .attr('transform', 'translate(19,5.5)')
            .attr('id', 'MStart')
            .attr('opacity', '0.2')
            .attr('class', 'line');
        self.svg.append('text')
            .attr('transform', 'translate(' + (self.x(new Date(self.MovinBlueWindowStart[0]['Date'])) + 10) + ',' + 340 + ')')
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .attr('id', 'MStartTxt')
            .style('fill', 'red')
            .style('font-size', '10px')
            .text(self.MovinBlueWindowStart[0].DispDate);
        self.svg.append('path').data([self.MovinBlueWindowEnd])
            .attr('class', 'path')
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', self.valueline6(self.MovinBlueWindowEnd))
            .attr('transform', 'translate(19,5.5)')
            .attr('id', 'MEnd')
            .attr('opacity', '0.2')
            .attr('class', 'line');
        self.svg.append('text')
            .attr('transform', 'translate(' + (self.x(new Date(self.MovinBlueWindowEnd[0]['Date'])) + 5) + ',' + 340 + ')')
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .attr('id', 'MEndTxt')
            .style('fill', 'red')
            .style('font-size', '10px')
            .text(self.MovinBlueWindowEnd[0].DispDate);

        // window end lines

        self.svg.selectAll('rect')
            .attr('transform', 'translate(' + 19 + ',' + self.margin.top + ')')
            .data(self.rectangle)
            .call(d3Drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
            );

        const dragBounds = {
            top: null,
            left: null,
            bottom: null,
            right: null
        };
        const tickHeight = 10;

        function setDragBounds(subject) {
            dragBounds.top = 5 - self.margin.top;
            dragBounds.left = 11 - self.margin.left;
            dragBounds.bottom = self.xAxisHeight - tickHeight - subject.attr('height');
            dragBounds.right = (self.width + 50) - self.rectWidth;
        }

        function dragstarted() {
            /*
              Calculate drag bounds at dragStart because it's one event vs many
              events if done in 'dragged()'
            */
            setDragBounds(d3Select(this));
            self.dragID = this.id;
            d3Select(this).raise().classed('active', true);
        }

        function dragged(d) {
            if (self.graphType === 'Daily' && self.isEditable && (self.dragID === '1drag' || self.OriginBlueWindowStart === null)) {
                d3Select(this)
                    .attr('x', getX(d.x = d3Event.x))
                    .attr('y', getY(d.y = d3Event.y));
            }
        }

        function getX(x) {
            return x < dragBounds.left ? dragBounds.left
                : x > dragBounds.right ? dragBounds.right
                    : x;
        }

        function getY(y) {
            return y < dragBounds.top ? dragBounds.top
                : y > dragBounds.bottom ? dragBounds.bottom
                    : y;
        }

        function dragended(d) {
            d3Select(this).classed('active', false);
            const rectStartDate = formatDate(self.x.invert(getX(d.x)));
            const rectEndDate = formatDate(self.x.invert(getX(d.x) + self.rectWidth));
            windowMoved(rectStartDate, rectEndDate);

        }

        function windowMoved(startDate, endDate) {
            // console.log(startDate)
            // console.log(endDate)
            if (self.graphType === 'Daily' && self.isEditable && (self.dragID === '1drag' || self.OriginBlueWindowStart === null)) {
                self.rectChangeDates.emit({ DEMAND_START_DATE: startDate, DEMAND_END_DATE: endDate });
            }
        }

        function formatDate(date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) { month = '0' + month; }
            if (day.length < 2) { day = '0' + day; }

            return [year, month, day].join('-');
        }


        self.svg.append('g') // Add the X Axis
            .attr('class', 'x axis')
            .attr('transform', 'translate(20,' + self.xAxisHeight + ')')
            .call(d3.axisBottom(self.x).tickValues([]))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-65)');


        self.svg.append('g') // Add the Y Axis
            .attr('class', 'y axis')
            .attr('transform', 'translate(20,5)')
            .call(d3.axisLeft(self.y));

    }

    ngOnInit() {
        this.getGraphData();

    }


    changeGraph() {
        this.gType.emit({ graphType: this.graphType, graphData: this.graphdata });
    }


}
