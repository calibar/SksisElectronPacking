declare var ol: any;

var geoserverBaseURL = 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms';
var webMercatorProjection = 'EPSG:3857';

export var mapView = new ol.View({
    center: ol.proj.fromLonLat([-105.7500, 52.1334]),
    zoom: 6,
    maxZoom: 17
});

// SK soil polygons map layer
export var polygonsLayer = new ol.layer.Tile({
    visible: true,
    selectable: true,
    title: 'Soil Polygons',
    name: 'polygons',
    source: new ol.source.TileWMS({
        projection: webMercatorProjection,
        url: geoserverBaseURL,
        params: {
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'sksoil:sk_soil_zone',
        }
    })
});

// Static reference to the default polygon theme to be reference by the map click
export var staticPolygonsLayer = new ol.layer.Tile({
    visible: true,
    title: 'Soil Polygons',
    name: 'polygons',
    source: new ol.source.TileWMS({
        projection: webMercatorProjection,
        url: geoserverBaseURL,
        params: {
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'sksoil:polygon_theme',
        }
    })
});

var centralButteGeoTiff = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        crossOrigin: 'anonymous',
        ratio: 1,
        url: geoserverBaseURL,
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:SUR_TEX_KNN'
        }
    })
});

// Open Street Basemap
export var openStreeMap = new ol.layer.Tile({
    source: new ol.source.OSM()
});
openStreeMap.name = "Default";
openStreeMap.id = 3;

// Bing Satellite Basemap
export var bingMapsAerial = new ol.layer.Tile({
    preload: Infinity,
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AjuiTz-K1RGALYtpTD5ikQXwQjDIkKGqaxBh-cNJA8BxPcdzxLyTQ4c-RInRBTE7',
        imagerySet: 'Aerial',
    })
});
bingMapsAerial.name ="Aerial";
bingMapsAerial.id = 0;

// Bing Hybrid Basemap
export var bingMapsHybrid = new ol.layer.Tile({
    preload: Infinity,
    visible: false,
    zoomLevel: 10,
    source: new ol.source.BingMaps({
        key: 'AjuiTz-K1RGALYtpTD5ikQXwQjDIkKGqaxBh-cNJA8BxPcdzxLyTQ4c-RInRBTE7',
        imagerySet: 'AerialWithLabels',
    })
});
bingMapsHybrid.name =  "Hybrid";
bingMapsHybrid.id = 1;

// Dark Matter Basemap
export var darkMatter = new ol.layer.Tile({
    visible: false,
    attribution: '<a href="https://www.mapzen.com/rights">Attribution.</a>. Data &copy;<a href="https://openstreetmap.org/copyright">OSM</a> contributors.',
    source: new ol.source.OSM({
        "url" : "http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
    })
});
darkMatter.name = "Dark";
darkMatter.id = 2;

// Layer containing all point data
export var pointsLayer = new ol.layer.Tile({
    visible: true,
    source: new ol.source.TileWMS({
        url: geoserverBaseURL,
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            VIEWPARAMS: 'latitude:6654335.22497;longitude:-11728863.28418',
            STYLES: '',
            LAYERS: 'sksoil:sk_point_data',

        }
    })
});

export var staticPointsLayer = new ol.layer.Tile({
    visible: true,
    source: new ol.source.TileWMS({
        url: geoserverBaseURL,
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            VIEWPARAMS: 'latitude:6654335.22497;longitude:-11728863.28418',
            STYLES: '',
            LAYERS: 'sksoil:sk_point_data',

        }
    })
});

export var labelsLayer = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: geoserverBaseURL,
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'sksoil:polygon_label_layer',
        }
    })
});

export var linesLayer = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileWMS({
        url: geoserverBaseURL,
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'sksoil:polygon_stroke',
        }
    })
});

//sksoil:saskgrid_2015_section
export var sectionLayer = new ol.layer.Image({
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: geoserverBaseURL,
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:saskgrid_2015_section',
        }
    })
});

//sksoil:Traite_Pre_1975_Treaty_SHP
export var treatyLayer = new ol.layer.Image({
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:Traite_Pre_1975_Treaty_SHP',
        }
    })
});

var hillshade = new ol.layer.Tile({
    visible: true,
    source: new ol.source.TileWMS({
        url: 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'sksoil:hillshademc2',
            tilesOrigin: -12607795.409530485 + "," + 6080892.065533002
        }
    })
});

export var ruralMunicipalities = new ol.layer.Image({
    visible: true,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:saskadmin_2016_rural_municipality',
        }
    })
});


export var nts = new ol.layer.Image({
    visible:true,
    source: new ol.source.ImageWMS({
        projection: 26913,
        ratio: 1,
        url: 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {'FORMAT': 'img/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:nts_snrc_250k',
        }
    })
});

export var township = new ol.layer.Image({
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:saskgrid_2015_township',
        }
    })
});

export var soilZone = new ol.layer.Image({
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:sk_soil_zone'
        }
    })
});

export var urbanCenters = new ol.layer.Image({
    visible: true,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'https://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:sk_urban'
        }
    })
});

export function makePolygonOutlinesVisible(condition: boolean){
    layers[2].setVisible(condition);
}

export function setPolygonOpacity(opacity:number){
    if(opacity){
        polygonsLayer.setOpacity(opacity);    
    }
}

export function setLayerVisible(layer: mapLayers, visible: boolean) {
    layers[layer].setVisible(visible);
}

export function updatePointLayerParameters(parameters) {
    pointsLayer.getSource().updateParams(parameters)
}

export enum mapLayers {
    POLYGONS,
    POINTS,
    POLYGON_OUTLINES,
    LABELS,
    SECTIONS,
    TREATY,
    CBGEOTIFF,
    TOWNSHIP,
    SOILZONE,
    RMS,
    URBAN_CENTERS
}

export var basemaps = [
    openStreeMap,
    bingMapsAerial,
    bingMapsHybrid,
    darkMatter
];

export var layers = [
    polygonsLayer,
    pointsLayer,
    linesLayer,
    labelsLayer,
    sectionLayer,
    treatyLayer,
    centralButteGeoTiff,
    township,
    soilZone,
    ruralMunicipalities,
    urbanCenters
];


