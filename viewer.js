async function ShowGoogleMapTileSet() {
  // Add Photorealistic 3D Tiles
  try {
    googleTileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(googleTileset);
    ShowRain();
    googleTileset.initialTilesLoaded.addEventListener(function () {
      ShowGISData();
    });
    //AdjustCloudySky();
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset.
  ${error}`);
  }
}
function GetlonlatheightfromCartesian(cartesian) {
  if (Cesium.defined(cartesian)) {
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartographic = ellipsoid.cartesianToCartographic(cartesian);
    var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
    var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);
    var height = cartographic.height.toFixed(3);
    return { lon: lon, lat: lat, height: height };
  } else {
    return { lon: null, lat: null, height: null };
  }
}
async function ShowTerrain() {
  viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
}
function ShowRain() {
  if (rainPrimitive != null) {
    scene.primitives.remove(rainPrimitive);
  }
  rainPrimitive = scene.primitives.add(
    new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(
        Cesium.Cartesian3.fromDegrees(
      -79.93900144975106,
      32.7757460987065, 
      700
        )
      ),
      speed: -1.0,
      lifetime: 15.0,
      emitter: new Cesium.SphereEmitter(rainRadius),
      startScale: 10.0,
      endScale: 5.0,
      image: "images/circular_particle.png",
      emissionRate: 20000.0,
          startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
          endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
      imageSize: rainImageSize,
      updateCallback: rainUpdate,
    })
  );
  scene.skyAtmosphere.hueShift = -0.97;
  scene.skyAtmosphere.saturationShift = 0.25;
  scene.skyAtmosphere.brightnessShift = -0.4;
  scene.fog.density = 0.00025;
  scene.fog.minimumBrightness = 0.01;
}
function rainUpdate(particle, dt) {
  rainGravityScratch = Cesium.Cartesian3.normalize(
    particle.position,
    rainGravityScratch
  );
  rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
    rainGravityScratch,
    -1050.0,
    rainGravityScratch
  );

  particle.position = Cesium.Cartesian3.add(
    particle.position,
    rainGravityScratch,
    particle.position
  );

  const distance = Cesium.Cartesian3.distance(
    Cesium.Cartesian3.fromDegrees(-79.92803447362073, 32.76685316071733, 500),
    particle.position
  );
  if (distance > rainRadius) {
    particle.endColor.alpha = 0.0;
  } else {
    particle.endColor.alpha =
      Cesium.Color.BLUE.alpha / (distance / rainRadius + 0.1);
  }
}
async function ShowGISData() {
  for (const geojsonObj of GeojsonData) {
    await LoadGeojson(
      geojsonObj.layerurl,
      geojsonObj.layerName,
      geojsonObj.IsChecked
    );
  }
}
async function LoadGeojson(layerurl, layerName, isChecked) {
  //const resource = await Cesium.IonResource.fromAssetId(Number(assetId));
  try {
    const dataSource = await Cesium.GeoJsonDataSource.load(layerurl);
    await viewer.dataSources.add(dataSource);
    var assetId = Math.floor(100000 + Math.random() * 900000);
    dataSource.show = isChecked;
    var layerId = "geojson_" + assetId;
    var geojsonObj = {
      layerName: layerName,
      layerId: layerId,
      dataSource: dataSource,
    };
    GeojsonList.push(geojsonObj);
    var layerDiv =
      '<div class="w-full flex items-center justify-between cursor-pointer pr-[5px]">' +
      '<div class="flex items-center mb-1.5"><div class="form-check ml-2">' +
      '<input class="form-check-input w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2" type="radio" name="geojson"  id="layer_' +
      layerId.replaceAll(" ", "_").replaceAll("#", "") +
      '"onchange="RenderGeojson(\'' +
      layerId.replaceAll(" ", "_").replaceAll("#", "") +
      "','" +
      layerName +
      "')\">" +
      "</div>" +
      '<div class="text-sm overflow-hidden font-roboto mt-1">' +
      layerName +
      '<div class="flex items-center justify-center">' +
      "</div></div>";
    $("#layerPanel").append(layerDiv);
    $("#layer_" + layerId).prop("checked", isChecked);
    //Get the array of entities
    var entities = dataSource.entities.values;
    for (const entity of entities) {
      if (Cesium.defined(entity.polyline)) {
        entity.polyline.material = new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString("aqua").withAlpha(0.7)
        );
      } else if (Cesium.defined(entity.polygon)) {
        entity.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        //const color = Cesium.Color.fromCssColorString("#716E69");
        const color = Cesium.Color.fromCssColorString("#0c1150");
        //const color = Cesium.Color.fromCssColorString("blue");
		
        color.alpha = 0.8;
        entity.polygon.material = color;
        entity.polygon.outline = false;
      }
    }
  } catch (error) {
    console.log(`Error loading geojson layer called ${layerName}`);
  }
}
function RenderGeojson(layerId, layerName) {
  GeojsonList.forEach((geojson) => {
    if (geojson.layerId == layerId) {
      geojson.dataSource.show = true;
      if (layerName == "Sea Level - 2040") {
        GoTo2040Layer();
      } else if (layerName == "Sea Level - 2060") {
        GoTo2060Layer();
      } else if (layerName == "Sea Level - 2080") {
        GoTo2080Layer();
      }
    } else {
      geojson.dataSource.show = false;
    }
  });
}

function AdjustCloudySky() {
  skyAtmosphere.atmosphereLightIntensity = parseFloat(30);
  skyAtmosphere.brightnessShift = parseFloat(-0.18);
  skyAtmosphere.saturationShift = parseFloat(-0.62);
  skyAtmosphere.hueShift = -0.77;
}
function GoTo2040Layer() {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      -79.93890026173389,
      32.779989791521466,
      200
    ),

    orientation: {
      heading: Cesium.Math.toRadians(190.0),
      pitch: Cesium.Math.toRadians(-30.0),
    },
  });
}
function GoTo2060Layer() {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      -79.94455, 
      32.77965976074353, 
      150
    ),

    orientation: {
      heading: Cesium.Math.toRadians(212.0),
      pitch: Cesium.Math.toRadians(-50.0),
	  roll:  Cesium.Math.toRadians(359.0),
    },
  });
}
function GoTo2080Layer() {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      -79.96155939802325, 
      32.77671423653934,
      150
    ),
 
    orientation: {
      heading: Cesium.Math.toRadians(55.773963130040016),
      pitch: Cesium.Math.toRadians(-15.242789541555059),
	  roll:  Cesium.Math.toRadians(0.0008993484637261061),
    },
  });
}
function ReadGeoJson() {
  $.getJSON("Geojson/test.json", function (data) {
    $.each(data.features, function (key, val) {
      geometry = val.geometry;
    });
  });
}
function createRandomClouds(
  numClouds,
  startLong,
  stopLong,
  startLat,
  stopLat,
  minHeight,
  maxHeight
) {
  const rangeLong = stopLong - startLong;
  const rangeLat = stopLat - startLat;
  
  for (let i = 0; i < numClouds; i++) {
    long = startLong + getRandomNumberInRange(0, rangeLong);
    lat = startLat + getRandomNumberInRange(0, rangeLat);
    height = getRandomNumberInRange(minHeight, maxHeight);
    scaleX = getRandomNumberInRange(150, 350);
    scaleY = scaleX / 2.0 - getRandomNumberInRange(0, scaleX / 4.0);
    slice = getRandomNumberInRange(0.3, 0.7);
    depth = getRandomNumberInRange(5, 20);
    aspectRatio = getRandomNumberInRange(1.5, 2.1);
    cloudHeight = getRandomNumberInRange(5, 20);
    clouds.add({
      position: Cesium.Cartesian3.fromDegrees(long, lat, height),
      scale: new Cesium.Cartesian2(scaleX, scaleY),
      maximumSize: new Cesium.Cartesian3(
        aspectRatio * cloudHeight,
        cloudHeight,
        depth
      ),
      slice: slice,
    });
  }
}
function getRandomNumberInRange(minValue, maxValue) {
  return minValue + Cesium.Math.nextRandomNumber() * (maxValue - minValue);
}
