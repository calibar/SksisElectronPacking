import { Component } from '@angular/core';

@Component({
    selector: 'doughnut-chart',
    template: require('./doughnutchart.template.html')
})
export class DoughnutChartComponent {
    // Doughnut
    public doughnutChartLabels:string[] = ["Test"];
    public doughnutChartData:number[] = [60,60,60,60,60,60];
    public doughnutChartType:string = 'doughnut';

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }

    public setChartLabels(newLabels:string[]):void {
        if (newLabels && newLabels != []){
            this.doughnutChartLabels = newLabels;
            console.log("got new labels")
        } else {
            this.doughnutChartLabels = [''];
        }

        console.log(newLabels)
    }

    public setChartData(newData:number[]):void {
        console.log("Data:");
        console.log(newData)

        if (newData && newData != []) {
            //this.doughnutChartData = newData;
            setTimeout(() => {
                this.doughnutChartData = newData;
            }, 50);
        } else {
            this.doughnutChartData = [0];
        }
    }
}