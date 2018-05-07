import {Component, Output, EventEmitter} from '@angular/core';
import {basemaps} from "../../assets/geospatial";
import { Http }          from '@angular/http';

declare var $:JQueryStatic;
declare var jQuery:any;

@Component({
    selector: 'toolbox',
    template: require('./toolbox.template.html'),
    styles: [require('./toolbox.css').toString()]
})
export class ToolboxComponent {

    @Output() changeBasemapEmitter                  = new EventEmitter();
    @Output() toggleLayerEmitter                    = new EventEmitter();
    @Output() changeThemeEmitter                    = new EventEmitter();
    @Output() changePointTypeEmitter                = new EventEmitter();
    @Output() toggleTreatyEmitter                   = new EventEmitter();
    @Output() changePolygonOpacityEmitter           = new EventEmitter();
    @Output() goToDsmEmitter                        = new EventEmitter();

    constructor (private http: Http) {}

    polygonOpacity: number;

    bmaps = [];

    themes = [
        {name: 'Soil Zone',                         value: 'sksoil:sk_soil_zone',           theme: 'sk_soil_zone'},
        {name: 'Map Unit',                          value: 'sksoil:polygon_theme',          theme: ''},
        {name: 'Agricultural Capability',           value: 'sksoil:capblty_theme_layer',    theme: 'capclass'},
        {name: 'Texture',                           value: 'sksoil:text1_theme_layer',      theme: 'dominant_texture_classes'},
        {name: 'Salinity/Electrical Conductivity',  value: 'sksoil:salsym_theme_layer',     theme: 'salinity_affect_prod'},
        {name: 'pH',                                value: 'sksoil:phsym_theme_layer',      theme: 'phelegend'}

    ];

    pointDataTypes = [
        {name: 'Photos',        selected: false, value: 'photo'},
        {name: 'Soil Pits',     selected: false, value: 'soilpit'},
        {name: 'Publications',  selected: false, value: 'publication'},
        {name: 'Observations',  selected: false, value: 'observation'},
    ];

    ngOnInit(){
        this.bmaps = basemaps;
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

    changePolygonOpacity(event){
        this.changePolygonOpacityEmitter.emit(event);
    }

    changeBasemap(event){
        this.changeBasemapEmitter.emit(event);
    }

    changeLayers(event){
        this.toggleLayerEmitter.emit(event);
    }

    changeTheme(event){
        this.changeThemeEmitter.emit(event);
    }

    toggleTreaty(event){
        this.toggleTreatyEmitter.emit(event);
    }

    changePointType(clicked){
        this.changePointTypeEmitter.emit(this.pointDataTypes.filter( (type)=> type.selected ));
    }

    goToDsm(event) {
        this.goToDsmEmitter.emit(event);
    }
}
