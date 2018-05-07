"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geoserverBaseURL = 'http://sksoilgis1.usask.ca/geoserver/sksoil/wms';
var webMercatorProjection = 'EPSG:3857';
exports.mapView = new ol.View({
    center: ol.proj.fromLonLat([-105.7500, 52.1334]),
    zoom: 6
});
// SK soil polygons map layer
exports.polygonsLayer = new ol.layer.Tile({
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
            LAYERS: 'sksoil:polygon_theme',
        }
    })
});
// Static reference to the default polygon theme to be reference by the map click
exports.staticPolygonsLayer = new ol.layer.Tile({
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
        ratio: 1,
        url: 'http://sksoilgis1.usask.ca:80/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:SUR_TEX_KNN_Uncertainty'
        }
    })
});
// Open Street Basemap
exports.openStreeMap = new ol.layer.Tile({
    source: new ol.source.OSM()
});
exports.openStreeMap.name = "Default";
exports.openStreeMap.id = 3;
// Bing Satellite Basemap
exports.bingMapsAerial = new ol.layer.Tile({
    preload: Infinity,
    visible: false,
    source: new ol.source.BingMaps({
        key: 'AjuiTz-K1RGALYtpTD5ikQXwQjDIkKGqaxBh-cNJA8BxPcdzxLyTQ4c-RInRBTE7',
        imagerySet: 'Aerial',
    })
});
exports.bingMapsAerial.name = "Aerial";
exports.bingMapsAerial.id = 0;
// Bing Hybrid Basemap
exports.bingMapsHybrid = new ol.layer.Tile({
    preload: Infinity,
    visible: false,
    zoomLevel: 10,
    source: new ol.source.BingMaps({
        key: 'AjuiTz-K1RGALYtpTD5ikQXwQjDIkKGqaxBh-cNJA8BxPcdzxLyTQ4c-RInRBTE7',
        imagerySet: 'AerialWithLabels',
    })
});
exports.bingMapsHybrid.name = "Hybrid";
exports.bingMapsHybrid.id = 1;
// Dark Matter Basemap
exports.darkMatter = new ol.layer.Tile({
    visible: false,
    attribution: '<a href="https://www.mapzen.com/rights">Attribution.</a>. Data &copy;<a href="https://openstreetmap.org/copyright">OSM</a> contributors.',
    source: new ol.source.OSM({
        "url": "http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
    })
});
exports.darkMatter.name = "Dark";
exports.darkMatter.id = 2;
// Layer containing all point data
exports.pointsLayer = new ol.layer.Tile({
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
exports.staticPointsLayer = new ol.layer.Tile({
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
exports.labelsLayer = new ol.layer.Tile({
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
exports.linesLayer = new ol.layer.Tile({
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
exports.sectionLayer = new ol.layer.Image({
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
exports.treatyLayer = new ol.layer.Image({
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://sksoilgis1.usask.ca/geoserver/sksoil/wms',
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
        url: 'http://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: { 'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'sksoil:hillshademc2',
            tilesOrigin: -12607795.409530485 + "," + 6080892.065533002
        }
    })
});
exports.ruralMunicipalities = new ol.layer.Image({
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:saskadmin_2016_rural_municipality',
        }
    })
});
exports.nts = new ol.layer.Image({
    visible: true,
    source: new ol.source.ImageWMS({
        projection: 26913,
        ratio: 1,
        url: 'http://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: { 'FORMAT': 'img/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:nts_snrc_250k',
        }
    })
});
exports.township = new ol.layer.Image({
    visible: false,
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://sksoilgis1.usask.ca/geoserver/sksoil/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: 'sksoil:saskgrid_2015_township',
        }
    })
});
function makePolygonOutlinesVisible(condition) {
    exports.layers[2].setVisible(condition);
}
exports.makePolygonOutlinesVisible = makePolygonOutlinesVisible;
function setPolygonOpacity(opacity) {
    if (opacity) {
        exports.polygonsLayer.setOpacity(opacity);
    }
}
exports.setPolygonOpacity = setPolygonOpacity;
function setLayerVisible(layer, visible) {
    exports.layers[layer].setVisible(visible);
}
exports.setLayerVisible = setLayerVisible;
var mapLayers;
(function (mapLayers) {
    mapLayers[mapLayers["POLYGONS"] = 0] = "POLYGONS";
    mapLayers[mapLayers["POINTS"] = 1] = "POINTS";
    mapLayers[mapLayers["POLYGON_OUTLINES"] = 2] = "POLYGON_OUTLINES";
    mapLayers[mapLayers["LABELS"] = 3] = "LABELS";
    mapLayers[mapLayers["SECTIONS"] = 4] = "SECTIONS";
    mapLayers[mapLayers["TREATY"] = 5] = "TREATY";
    mapLayers[mapLayers["CBGEOTIFF"] = 6] = "CBGEOTIFF";
    mapLayers[mapLayers["TOWNSHIP"] = 7] = "TOWNSHIP";
    mapLayers[mapLayers["RMS"] = 8] = "RMS";
})(mapLayers = exports.mapLayers || (exports.mapLayers = {}));
exports.basemaps = [
    exports.openStreeMap,
    exports.bingMapsAerial,
    exports.bingMapsHybrid,
    exports.darkMatter
];
exports.layers = [
    exports.polygonsLayer,
    exports.pointsLayer,
    exports.linesLayer,
    exports.labelsLayer,
    exports.sectionLayer,
    exports.treatyLayer,
    centralButteGeoTiff,
    exports.township,
    exports.ruralMunicipalities
];
//# sourceMappingURL=geospatial.js.map