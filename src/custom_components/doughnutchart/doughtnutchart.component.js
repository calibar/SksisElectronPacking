"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let DoughnutChartComponent = class DoughnutChartComponent {
    constructor() {
        // Doughnut
        this.doughnutChartLabels = ["Test"];
        this.doughnutChartData = [60, 60, 60, 60, 60, 60];
        this.doughnutChartType = 'doughnut';
    }
    // events
    chartClicked(e) {
        console.log(e);
    }
    chartHovered(e) {
        console.log(e);
    }
    setChartLabels(newLabels) {
        if (newLabels && newLabels != []) {
            this.doughnutChartLabels = newLabels;
            console.log("got new labels");
        }
        else {
            this.doughnutChartLabels = [''];
        }
        console.log(newLabels);
    }
    setChartData(newData) {
        console.log("Data:");
        console.log(newData);
        if (newData && newData != []) {
            //this.doughnutChartData = newData;
            setTimeout(() => {
                this.doughnutChartData = newData;
            }, 50);
        }
        else {
            this.doughnutChartData = [0];
        }
    }
};
DoughnutChartComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'doughnut-chart',
        templateUrl: './doughnutchart.template.html'
    })
], DoughnutChartComponent);
exports.DoughnutChartComponent = DoughnutChartComponent;
//# sourceMappingURL=doughtnutchart.component.js.map