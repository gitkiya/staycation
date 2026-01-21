mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
     container : "map", // container ID
     center: coordinate, // starting position [lng, lat]. Note that lat must be set between -90 and 90
     zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker()
    .setLngLat(coordinate)
    .setPopup(new mapboxgl.Popup().setHTML(`<h4>${listing.title}</h4>`)) // add popup
    .addTo(map);
