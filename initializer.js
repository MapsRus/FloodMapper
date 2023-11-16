$(function () {
  // Grant CesiumJS access to your ion assets
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDNlZjk5MC1iMjliLTQ1NTYtYWQ0MC0yMDljZDBhMmMyNWEiLCJpZCI6MTY5MjczLCJpYXQiOjE2OTYwMDMzODJ9.3Q6GkVL_JQrNduboyY_p5ducyy7wlzuglF-npBiY5uc";
  Cesium.GoogleMaps.defaultApiKey = "AIzaSyDTXbPV5vjBAwjN83TF0Wr6afPiusxzxGE";
  viewer = new Cesium.Viewer("cesiumContainer", {
    selectionIndicator: false,
    fullscreenButton: false,
    //geocoder: false,
    navigationHelpButton: false,
    selectionIndicator: false,
    sceneModePicker: false,
    animation: false,
    timeline: false,
    homeButton: false,
    shouldAnimate: true,
	
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true,
      },
    },
  });
  document.getElementsByClassName("cesium-viewer-bottom")[0].remove();
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.highDynamicRange = false;
  viewer.scene.globe.enableLighting = false;
  viewer.scene.fog.enabled = true;
  viewer.scene.fog.density = 1.5;
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );
  Cesium.GeoJsonDataSource.clampToGround = true;
  rainImageSize = new Cesium.Cartesian2(
    rainParticleSize,
    rainParticleSize * 2.0
  );
  rainGravityScratch = new Cesium.Cartesian3();
  // To see the ground
  layers = viewer.scene.imageryLayers;
  camera = viewer.camera;
  scene = viewer.scene;
  canvas = viewer.scene.canvas;
  globe = scene.globe;
  skyAtmosphere = scene.skyAtmosphere;
  clouds = scene.primitives.add(
    new Cesium.CloudCollection({
      noiseDetail: 16.0,
      noiseOffset: Cesium.Cartesian3.ZERO,
    })
  );
  
  
  
  
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3.fromDegrees(
      -79.93376581052684,
      32.78860798878529,
      1000
    ),
    orientation: {
        heading : Cesium.Math.toRadians(205.0),
        pitch : Cesium.Math.toRadians(-25.0)
    },
    complete: ShowGoogleMapTileSet,
  });
  ShowTerrain();
  createRandomClouds(500, 10.753355411332045, 10.720871434853432, 47.5558168017091,  47.558500149337966, 300, 2000);
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (event) {
    var earthPosition = viewer.scene.pickPosition(event.position);
    var latlonObj = GetlonlatheightfromCartesian(earthPosition);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
});
