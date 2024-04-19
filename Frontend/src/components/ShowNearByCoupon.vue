<template>
  <div id="app">
    <div id="map" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
export default {
  name: 'ShowNearByCoupon',
  mounted() {
    this.loadGoogleMapsScript();
  },
  methods: {
    loadGoogleMapsScript() {
      if (!window.google) {
        const script = document.createElement('script');
        // 修正：移除了重复的 'script.src =' 部分
        
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places,marker&v=weekly`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        window.initMap = this.initMap.bind(this);  // 确保正确绑定 initMap 函数
      } else {
        this.initMap();
      }
    },
    initMap() {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.033, lng: 121.5654 },
        zoom: 15,
        mapId: "DEMO_MAP_ID"  // 使用示例 map ID 适用于高级标记
      });

      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: { lat: 25.033, lng: 121.5654 },
        radius: 1000,
        type: ['restaurant']
      }, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          results.forEach(place => {
            new window.google.maps.marker.AdvancedMarkerElement({
              map: map,
              position: place.geometry.location,
              title: place.name
            });
          });
        }
      });
    }
  }
}
</script>

<style scoped>
#map {
  height: 100%;
}
</style>
