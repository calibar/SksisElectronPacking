"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const geospatial_1 = require("../../assets/geospatial");
const http_1 = require("@angular/http");
let ToolboxComponent = class ToolboxComponent {
    constructor(http) {
        this.http = http;
        this.changeBasemapEmitter = new core_1.EventEmitter();
        this.toggleLayerEmitter = new core_1.EventEmitter();
        this.changeThemeEmitter = new core_1.EventEmitter();
        this.changePointTypeEmitter = new core_1.EventEmitter();
        this.toggleTreatyEmitter = new core_1.EventEmitter();
        this.changePolygonOpacityEmitter = new core_1.EventEmitter();
        this.bmaps = [];
        this.themes = [
            { name: 'Default Polygon Theme', value: 'sksoil:polygon_theme', theme: '' },
            { name: 'Agricultural Capability', value: 'sksoil:capblty_theme_layer', theme: 'capclass' },
            { name: 'Texture', value: 'sksoil:text1_theme_layer', theme: 'dominant_texture_classes' },
            { name: 'Salinity/Electrical Conductivity', value: 'sksoil:salsym_theme_layer', theme: 'salinity_affect_prod' },
            { name: 'pH', value: 'sksoil:phsym_theme_layer', theme: 'phelegend' }
        ];
        this.pointDataTypes = [
            { name: 'Photos', selected: false, value: 'photo' },
            { name: 'Soil Pits', selected: false, value: 'soilpit' },
            { name: 'Publications', selected: false, value: 'report' },
            { name: 'Observations', selected: false, value: 'observation' },
        ];
    }
    ngOnInit() {
        this.bmaps = geospatial_1.basemaps;
        this.polygonOpacity = 100;
        var options = [];
        // $( '.dropdown-menu a' ).on( 'click', function( event ) {
        //
        //     var $target = $( event.currentTarget ),
        //         val = $target.attr( 'data-value' ),
        //         $inp = $target.find( 'input' ),
        //         idx;
        //
        //     if ( ( idx = options.indexOf( val ) ) > -1 ) {
        //         options.splice( idx, 1 );
        //         setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
        //     } else {
        //         options.push( val );
        //         setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
        //     }
        //
        //     $( event.target ).blur();
        //
        //
        //     options.forEach( (option ) => {
        //         console.log(option)
        //         console.log(geospatial_assets.mapLayers[option])
        //         geospatial_assets.setLayerVisible(option, true)
        //     });
        //
        //     for (let i=0; i<6; i++){
        //         geospatial_assets.setLayerVisible(i, options.includes(i))
        //     }
        //
        //     return false;
        // });
        // $('.collapse-link').on('click', function () {
        //     var ibox = $(this).closest('div.ibox');
        //     var button = $(this).find('i');
        //     var content = ibox.find('div.ibox-content');
        //     content.slideToggle(200);
        //     button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        //     ibox.toggleClass('').toggleClass('border-bottom');
        //     setTimeout(function () {
        //         ibox.resize();
        //         ibox.find('[id^=map-]').resize();
        //     }, 50);
        // });
    }
    changePolygonOpacity(event) {
        this.changePolygonOpacityEmitter.emit(event);
    }
    changeBasemap(event) {
        this.changeBasemapEmitter.emit(event);
    }
    changeLayers(event) {
        this.toggleLayerEmitter.emit(event);
    }
    changeTheme(event) {
        this.changeThemeEmitter.emit(event);
    }
    toggleTreaty(event) {
        this.toggleTreatyEmitter.emit(event);
    }
    changePointType(clicked) {
        clicked.selected = (clicked.selected) ? false : true;
        this.changePointTypeEmitter.emit(this.pointDataTypes.filter((type) => type.selected));
    }
};
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], ToolboxComponent.prototype, "changeBasemapEmitter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], ToolboxComponent.prototype, "toggleLayerEmitter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], ToolboxComponent.prototype, "changeThemeEmitter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], ToolboxComponent.prototype, "changePointTypeEmitter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], ToolboxComponent.prototype, "toggleTreatyEmitter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], ToolboxComponent.prototype, "changePolygonOpacityEmitter", void 0);
ToolboxComponent = tslib_1.__decorate([
    core_1.Component({
        selector: 'toolbox',
        templateUrl: 'toolbox.template.html',
        styleUrls: ['./toolbox.css']
    }),
    tslib_1.__metadata("design:paramtypes", [http_1.Http])
], ToolboxComponent);
exports.ToolboxComponent = ToolboxComponent;
//# sourceMappingURL=toolbox.component.js.map