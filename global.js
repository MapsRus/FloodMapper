var googleTileset = null;
var geojsonDataSource = null;
var rainPrimitive = null;
var waterTexture = null;
var GeojsonList = [];
var GeojsonData = [
  {
    layerName: "Sea Level - 2040",
    assetId: 2312723,
    IsChecked: false,
    layerurl:"Geojson/2040.json"
  },
  {
    layerName: "Sea Level - 2060",
    assetId: 2312726,
    IsChecked: false,
    layerurl:"Geojson/2060.json"
  },
  {
    layerName: "Sea Level - 2080",
    assetId: 2312727,
    IsChecked: false,
    layerurl:"Geojson/2080.json"
  },
];
// rain
var rainParticleSize = 1.0;
var rainRadius = 10000.0;
