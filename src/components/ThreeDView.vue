<template>
  <div id="cesiumContainer"></div>
</template>

<script>
  export default {
    name: "three-d-view",

    mounted() {
      if (window.INITIAL.hide3DView) {
        return 0
      }

      let options = {
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        timeline: false,
        scene3DOnly: true,
        selectionIndicator: false,
        animation: false,
        globe: false,
        skyBox: new Cesium.SkyBox({show: false}),
        geocoder: false,
        infoBox: false,
        homeButton: false,
        contextOptions: {
          webgl: {
            preserveDrawingBuffer: true
          }
        }
      }

      Cesium.BingMapsApi.defaultKey = INITIAL.bingApiKey

      let viewer = new Cesium.Viewer('cesiumContainer', options)
      window.viewer = viewer

      function drawLabel(damage) {
        let lat = damage.geojson_centroid.features[0].geometry.coordinates[1]
        let lon = damage.geojson_centroid.features[0].geometry.coordinates[0]
        // get altitude from first point on linestring, centroid cannot delivery z coordinate
        let alt = damage.geojson.features[0].geometry.coordinates[0][2]

        if (damage.geojson.features[0].geometry.type === 'Polygon') {

          alt = damage.geojson.features[0].geometry.coordinates[0][2][2]

        }

        let labelRgbaColor = new Cesium.Color.fromCssColorString(damage.label_background_color)

        viewer.entities.add({
          name: damage.id,
          position: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
          label: {
            text: (damage.damage_id || '').toString(),
            font: '24px Helvetica',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            backgroundColor: labelRgbaColor,
            showBackground: true,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            eyeOffset: new Cesium.Cartesian3(damage.label_x_offset, damage.label_y_offset, damage.label_z_offset)
          }
        });
      }

      let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url: INITIAL.surveyAssetUrl,
        maximumScreenSpaceError: 16 // default value
      }))

      INITIAL.damages.forEach(damage => {
        if (Object.keys(damage.geojson).length) {
          //   viewer.dataSources.add(Cesium.GeoJsonDataSource.load(`/insights/api/damage/${damage.id}/geojson/`, {
          let datasource = Cesium.GeoJsonDataSource.load(damage.geojson, {
            stroke: Cesium.Color.BLUE,
            fill: Cesium.Color.RED,
            strokeWidth: 2,
            markerSymbol: '?'
          })

          // draw pin on 3D view
          drawLabel(damage)

          viewer.dataSources.add(datasource)
          viewer.dataSources.get(viewer.dataSources.length - 1).name = damage.id
        }
      })


      function flyTo({latitude, longitude, altitude, yaw, pitch, roll}, duration) {
        viewer.camera.flyTo({
          duration: duration || 1,
          destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
          orientation: {
            heading: Cesium.Math.toRadians(yaw),
            pitch: Cesium.Math.toRadians(pitch),
            roll: Cesium.Math.toRadians(roll)
          }
        })
      }

      tileset.readyPromise.then(function (tileset) {
        // Set initial camera view
        viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -5, 0));
        // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      })

      let initialPosition = this.$store.state.bookmarks.filter((bm) => {
        return bm.is_initial_position
      })[0]

      if (initialPosition) {
        flyTo(initialPosition, 0)
      }

      setInterval(function () {
        // workaround to make camera redraw and re-render vectorized damages
        viewer.camera.moveDown(0.0000001)
      }, 300)

      this.$bus.$on('fly-to', function ({latitude, longitude, altitude, yaw, pitch, roll}) {
        flyTo({latitude, longitude, altitude, yaw, pitch, roll})
      })

      this.$bus.$on('create-bookmark', (name) => {
        viewer.render()

        let camera = viewer.camera,
          cameraPosition = camera.positionCartographic,
          multiplier = Math.pow(10, 16),
          data = {
            name: name,
            screenshot: viewer.scene.canvas.toDataURL(),
            latitude: Math.round(Cesium.Math.toDegrees(cameraPosition.latitude) * multiplier) / multiplier,
            longitude: Math.round(Cesium.Math.toDegrees(cameraPosition.longitude) * multiplier) / multiplier,
            altitude: Math.round(cameraPosition.height * multiplier) / multiplier,
            yaw: Math.round(Cesium.Math.toDegrees(camera.heading) * multiplier) / multiplier,
            pitch: Math.round(Cesium.Math.toDegrees(camera.pitch) * multiplier) / multiplier,
            roll: Math.round(Cesium.Math.toDegrees(camera.roll) * multiplier) / multiplier,
          }
        this.$store.dispatch('createBookmark', data)
      })

      this.$bus.$on('save-camera-position', (id) => {
        let camera = viewer.camera,
          cameraPosition = camera.positionCartographic,
          multiplier = Math.pow(10, 16),
          data = {
            id: id,
            latitude: Math.round(Cesium.Math.toDegrees(cameraPosition.latitude) * multiplier) / multiplier,
            longitude: Math.round(Cesium.Math.toDegrees(cameraPosition.longitude) * multiplier) / multiplier,
            altitude: Math.round(cameraPosition.height * multiplier) / multiplier,
            yaw: Math.round(Cesium.Math.toDegrees(camera.heading) * multiplier) / multiplier,
            pitch: Math.round(Cesium.Math.toDegrees(camera.pitch) * multiplier) / multiplier,
            roll: Math.round(Cesium.Math.toDegrees(camera.roll) * multiplier) / multiplier,
          }
        this.$store.dispatch('updateImageCameraposition', data)
      })

      this.$bus.$on('showOnlyDamage', (damageId) => {
        for (let i=0,n=viewer.dataSources.length-1; i<n; i++){
          let ds = viewer.dataSources.get(i)
          ds.show = ds.name === damageId
        }

        viewer.entities.values.forEach((entity) => {
          entity.show = entity.name === damageId
        })
      })

      this.$bus.$on('highlightDamageLabel', (damageId) => {
        viewer.entities.values.forEach((entity) => {
          if (entity.name === damageId) {
            entity.label.fillColor = Cesium.Color.RED
          }
        })
      })

      this.$bus.$on('unhighlightDamageLabel', _ => {
        viewer.entities.values.forEach((entity) => {
          entity.label.fillColor = Cesium.Color.WHITE
        })
      })

      this.$bus.$on('updateDamageLabel', ({id, label}) => {
        viewer.entities.values.forEach((entity) => {
          if (entity.name === id) {
            entity.label.text = label
          }
        })
      })

      this.$bus.$on('updateDamageLabelOffset', ({id, label_x_offset, label_y_offset, label_z_offset, label_background_color}) => {
        viewer.entities.values.forEach((entity) => {
          if (entity.name === id) {
            entity.label.eyeOffset = new Cesium.Cartesian3(label_x_offset, label_y_offset, label_z_offset)
            entity.label.backgroundColor = new Cesium.Color.fromCssColorString(label_background_color)
          }
        })
      })

      this.$bus.$on('showAllDamages', () => {
        for (let i=0,n=viewer.dataSources.length-1; i<n; i++){
          let ds = viewer.dataSources.get(i)
          ds.show = true
        }
        viewer.entities.values.forEach((entity) => {
          entity.show = true
        })

      })

    }
  }
</script>

<style scoped>
  #cesiumContainer {
    height: 500px;
  }
</style>
