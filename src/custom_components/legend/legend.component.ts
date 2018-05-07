import { Component } from '@angular/core';

@Component({
    selector: 'legend',
    template: require('./legend.template.html')
})
export class LegendComponent{

    private themeInfo;
    private themeName;

    ngOnInit(): void {
            this.themeName = 'Default Polygon Theme';
        }

    getBackgroundColor(i){
        var color:string;
        color = '#';
        color += this.themeInfo[i].color;
        return color;
    }
}